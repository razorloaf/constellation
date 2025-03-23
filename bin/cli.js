#!/usr/bin/env node

import { Command } from 'commander';
import { transform } from '../src/index.js';
import path from 'path';
import fs from 'fs/promises';

const program = new Command();

program
  .name('constellation')
  .description('Transform color CSS files with enhanced color formats')
  .version('1.0.0');

program
  .command('transform')
  .description('Transform colors in a CSS file')
  .argument('<inputFile>', 'Input CSS file path')
  .argument('[outputFile]', 'Output CSS file path (optional, defaults to input file)')
  .option('-t, --theme <theme>', 'Color theme (light or dark)', 'light')
  .option('-f, --force', 'Force regeneration of all color formats', false)
  .action(async (inputFile, outputFile, options) => {
    try {
      // Make the input path absolute
      const inputPath = path.resolve(process.cwd(), inputFile);
      
      // If no output file specified, use the input file
      const outputPath = outputFile 
        ? path.resolve(process.cwd(), outputFile)
        : inputPath;
      
      // Check if input file exists
      try {
        await fs.access(inputPath);
      } catch (err) {
        console.error(`Error: Input file '${inputPath}' does not exist.`);
        process.exit(1);
      }
      
      // Transform the file
      console.log(`Transforming colors in ${inputPath}...`);
      console.log(`Theme detection: ON (Will auto-detect light/dark colors)`);
      if (options.force) {
        console.log(`Force mode: ON (Will regenerate all color formats)`);
      }
      
      await transform({
        input: inputPath,
        output: outputPath,
        theme: options.theme, // Used as fallback if auto-detection fails
        force: options.force
      });
      
      console.log(`\nColor transformation complete!`);
      if (inputPath === outputPath) {
        console.log(`File updated: ${inputPath}`);
      } else {
        console.log(`Output saved to: ${outputPath}`);
      }
      
      console.log('\nRemember: Only edit the original HEX values in your CSS file.');
      console.log('All other color formats are automatically generated during transform.');
      
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  })

program.parse();