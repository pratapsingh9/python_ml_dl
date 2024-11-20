#!/usr/bin/env node
import fs from 'fs/promises';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import open from 'open';
import { google } from 'googleapis';
import destroyer from 'server-destroy';
import chalk from 'chalk';
import figlet from 'figlet';
import gradient from 'gradient-string';
import ora from 'ora';
import { fileURLToPath } from 'url';
const require = createRequire(import.meta.url);
const readline = require('readline-sync');
const fsSync = require('fs');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration constants
const CONFIG = {
    CREDENTIALS_PATH: path.join(process.cwd(), 'credentials.json'),
    TOKEN_PATH: path.join(process.cwd(), 'token.json'),
    LAST_SYNC_PATH: path.join(process.cwd(), '.gditsync'),
    SCOPES: ['https://www.googleapis.com/auth/drive.file'],
    VERSION: '1.0.0'
};

// Hardcoded credentials
const HARD_CODED_CREDENTIALS = {
    "installed": {
        "client_id": "135450477137-cei6ptrgitdu7sodpetrutj3ji7hqf4p.apps.googleusercontent.com",
        "project_id": "just-clock-441208-b5",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_secret": "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",
        "redirect_uris": ["http://localhost"]
    }
};

// Custom error class for GDIT
class GDITError extends Error {
    constructor(message, code) {
        super(message);
        this.name = 'GDITError';
        this.code = code;
    }
}

// Display branded header
function displayHeader() {
    console.clear();
    const text = figlet.textSync('GDIT', { font: 'Big' });
    console.log(gradient.pastel.multiline(text));
    console.log(chalk.cyan('\n╔════════════════════════════════════════╗'));
    console.log(chalk.cyan('║        Google Drive Upload Tool         ║'));
    console.log(chalk.cyan('║          Created by Pratap 2973         ║'));
    console.log(chalk.cyan('║             v' + CONFIG.VERSION + '                  ║'));
    console.log(chalk.cyan('╚════════════════════════════════════════╝\n'));
}

// Authentication function
async function authenticate() {
    const spinner = ora('Checking authentication status...').start();
    try {
        // Using the hardcoded credentials instead of reading from a file
        const credentials = HARD_CODED_CREDENTIALS;

        if (!credentials.installed) {
            spinner.fail();
            throw new GDITError('Invalid credentials format. Please check your credentials.', 'INVALID_CREDS');
        }

        if (fsSync.existsSync(CONFIG.TOKEN_PATH)) {
            spinner.text = 'Verifying existing token...';
            try {
                const token = JSON.parse(await fs.readFile(CONFIG.TOKEN_PATH, 'utf8'));
                const oAuth2Client = new google.auth.OAuth2(
                    credentials.installed.client_id,
                    credentials.installed.client_secret,
                    'http://localhost:3000/oauth2callback'
                );
                oAuth2Client.setCredentials(token);
                const drive = google.drive({ version: 'v3', auth: oAuth2Client });
                await drive.files.list({ pageSize: 1 });
                spinner.succeed('Already authenticated!');
                return;
            } catch (error) {
                spinner.warn('Existing token is invalid. Requesting new authentication...');
                await fs.unlink(CONFIG.TOKEN_PATH);
            }
        }

        spinner.text = 'Starting authentication process...';
        await getAuthenticatedClient(credentials);
        spinner.succeed('Authentication completed successfully!');
    } catch (error) {
        spinner.fail(error.message);
        throw error;
    }
}

// OAuth2 callback handler
function getAuthenticatedClient(credentials) {
    return new Promise((resolve, reject) => {
        const { client_secret, client_id } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id,
            client_secret,
            'http://localhost:3000/oauth2callback'
        );

        const server = http
            .createServer(async (req, res) => {
                try {
                    if (req.url.indexOf('/oauth2callback') > -1) {
                        const qs = new URL(req.url, 'http://localhost:3000').searchParams;
                        const code = qs.get('code');
                        res.end('Authentication successful! You can close this window.');
                        server.destroy();

                        const { tokens } = await oAuth2Client.getToken(code);
                        oAuth2Client.setCredentials(tokens);
                        await fs.writeFile(CONFIG.TOKEN_PATH, JSON.stringify(tokens, null, 2));
                        resolve(oAuth2Client);
                    }
                } catch (e) {
                    reject(e);
                }
            })
            .listen(3000, () => {
                const authorizeUrl = oAuth2Client.generateAuthUrl({
                    access_type: 'offline',
                    scope: CONFIG.SCOPES,
                });
                console.log(chalk.blue('Opening browser for authentication...'));
                open(authorizeUrl);
            });

        destroyer(server);
    });
}

// Logout function
async function logout() {
    const spinner = ora('Logging out...').start();
    try {
        if (fsSync.existsSync(CONFIG.TOKEN_PATH)) {
            await fs.unlink(CONFIG.TOKEN_PATH);
            if (fsSync.existsSync(CONFIG.LAST_SYNC_PATH)) {
                await fs.unlink(CONFIG.LAST_SYNC_PATH);
            }
            spinner.succeed('Successfully logged out');
        } else {
            spinner.info('Not currently logged in');
        }
    } catch (error) {
        spinner.fail('Logout failed: ' + error.message);
        throw new GDITError('Logout failed: ' + error.message, 'LOGOUT_FAILED');
    }
}

// Main function
async function main() {
    try {
        displayHeader();

        const command = process.argv[2];

        if (!command) {
            console.log(chalk.blue("\nAvailable Commands:"));
            console.log(chalk.white("  gdit login  - Authenticate with Google Drive"));
            console.log(chalk.white("  gdit logout - Remove saved authentication"));
            console.log(chalk.white("  gdit push   - Upload files to Google Drive"));
            console.log(chalk.white("  gdit help   - Show this help message\n"));
            return;
        }

        switch (command) {
            case 'login':
                await authenticate();
                break;
            case 'logout':
                await logout();
                break;
            default:
                console.log(chalk.red('Unknown command. Use "gdit help" for a list of commands.'));
        }
    } catch (error) {
        console.error(chalk.red('Error: ' + error.message));
    }
}

main();