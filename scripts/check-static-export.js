#!/usr/bin/env node

/**
 * Static Export Detection Script for Next.js Deploy Workflow
 * Checks next.config.ts for static export configuration and outputs results
 */

const fs = require('fs');
const path = require('path');

// Configuration file path
const nextConfigPath = path.join(process.cwd(), 'next.config.ts');

function checkStaticExport() {
  try {
    if (!fs.existsSync(nextConfigPath)) {
      console.log('❌ next.config.ts not found');
      console.log('static-export=false');
      console.log('output-dir=out');
      return;
    }

    const configContent = fs.readFileSync(nextConfigPath, 'utf8');
    
    // Check for output: 'export' configuration
    const hasStaticExport = configContent.includes("output: 'export'") || 
                           configContent.includes('output:"export"') ||
                           configContent.includes("output:'export'");
    
    // Check for custom distDir configuration
    const distDirMatch = configContent.match(/distDir:\s*['"]([^'"]+)['"]/);
    const customDistDir = distDirMatch ? distDirMatch[1] : null;
    
    // Determine output directory
    const outputDir = hasStaticExport ? (customDistDir || 'out') : '.next';
    
    if (hasStaticExport) {
      console.log('✅ Static export configuration detected');
      console.log(`📁 Output directory: ${outputDir}`);
    } else {
      console.log('⚠️  No static export configuration found');
      console.log('💡 Consider adding output: "export" to next.config.ts for static deployment');
    }
    
    // Output GitHub Actions variables
    console.log(`static-export=${hasStaticExport}`);
    console.log(`output-dir=${outputDir}`);
    
  } catch (error) {
    console.error('❌ Error checking static export configuration:', error.message);
    console.log('static-export=false');
    console.log('output-dir=out');
    process.exit(1);
  }
}

// Run the check
checkStaticExport();
