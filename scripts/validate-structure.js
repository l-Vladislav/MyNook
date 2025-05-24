const Ajv2020 = require("ajv/dist/2020");
const addFormats = require('ajv-formats');
const fs = require('fs');
const crypto = require('crypto');

class ValidationError extends Error {
	constructor(errors) {
		super('Validation failed');
		this.name = 'ValidationError';
		this.errors = errors;
	}
}

class StructureValidator {
	
	constructor() {
		this.ajv = new Ajv2020({ 
			allErrors: true, 
			verbose: true,
			strict: false,
			validateFormats: false
		});
		addFormats(this.ajv);
	}

	async validate(structurePath, schemaPath) {
		const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
		const structure = JSON.parse(fs.readFileSync(structurePath, 'utf8'));
		
		const validate = this.ajv.compile(schema);
		const isValid = validate(structure);
		
		if (!isValid) {
			throw new ValidationError(validate.errors);
		}

		return this.validateFileSystemSync(structure);
	}

	validateFileSystemSync(structure) {
		const issues = [];
		
		Object.entries(structure.structure).forEach(([path, node]) => {
			if (node.status === 'exists') {
				if (!fs.existsSync(path)) {
					issues.push(`${node.type} marked as exists but not found: ${path}`);
				}
				
				const actualChecksum = this.calculateChecksum(path);
				if (node.type === 'file' && node.status === 'exists' && node.checksum && actualChecksum !== node.checksum) {
					issues.push(`Checksum mismatch for ${path}: expected ${node.checksum}, got ${actualChecksum}`);
				}
			}
		});

		return { valid: issues.length === 0, issues };
	}

	calculateChecksum(filePath) {
		try {
			const content = fs.readFileSync(filePath);
			return crypto.createHash('md5').update(content).digest('hex');
		} catch (error) {
			return null;
		}
	}
}

// Main execution
async function main() {
	if (process.argv.length < 4) {
		console.error('Usage: node validate-structure.js <structure-file> <schema-file>');
		process.exit(1);
	}

	const structurePath = process.argv[2];
	const schemaPath = process.argv[3];

	try {
		const validator = new StructureValidator();
		const result = await validator.validate(structurePath, schemaPath);
		
		if (result.valid) {
			console.log('✅ Structure validation passed');
		} else {
			console.log('❌ Structure validation failed:');
			result.issues.forEach(issue => console.log(`  - ${issue}`));
			process.exit(1);
		}
	} catch (error) {
		if (error instanceof ValidationError) {
			console.log('❌ Schema validation failed:');
			error.errors.forEach(err => {
				console.log(`  - ${err.instancePath || 'root'}: ${err.message}`);
				if (err.data !== undefined) {
					console.log(`	Value: ${JSON.stringify(err.data)}`);
				}
			});
		} else {
			console.error('❌ Validation error:', error.message);
		}
		process.exit(1);
	}
}

// Run if called directly
if (require.main === module) {
	main();
}

module.exports = StructureValidator;