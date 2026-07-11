#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, ListPromptsRequestSchema, GetPromptRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { searchMedicalInfo, SearchMedicalInfoSchema } from './tools/search.js';
import { fetchMedicalArticle, FetchMedicalArticleSchema } from './tools/fetch.js';
import { setPatientProfile, getPatientProfile, deletePatientProfile, SetPatientProfileSchema } from './tools/profile.js';
import { calculateClinicalScore, CalculateClinicalScoreSchema } from './tools/clinical-scores.js';
import { loadProfile, formatProfileForPrompt } from './profile/manager.js';
import { getDiagnosticPrompt } from './prompts/diagnostic.js';
/**
 * Doctor Claude MCP Server
 * Provides tools for searching and retrieving peer-reviewed medical information
 * from MedlinePlus and StatPearls (NCBI).
 */
class DoctorClaudeServer {
    server;
    constructor() {
        this.server = new Server({
            name: 'doctor-claude',
            version: '1.0.0',
        }, {
            capabilities: {
                tools: {},
                prompts: {},
            },
        });
        this.setupToolHandlers();
        this.setupPromptHandlers();
        this.setupErrorHandling();
    }
    setupToolHandlers() {
        // List available tools
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [
                {
                    name: 'search_medical_info',
                    description: 'Search for peer-reviewed medical information from MedlinePlus and StatPearls (NCBI). ' +
                        'Returns a list of relevant articles with titles, URLs, and descriptions. ' +
                        'IMPORTANT: Use simple, focused queries with 1-3 key medical terms for best results. ' +
                        'Avoid overly complex multi-word queries. If searching for specific patterns or presentations, ' +
                        'use the core condition/topic (e.g., "child abuse burns" instead of "geometric patterned skin lesions burns infants child abuse"). ' +
                        'The tool will automatically try simpler queries if the initial search returns no results. ' +
                        'This tool provides EDUCATIONAL information only - not medical advice, diagnoses, or treatment recommendations.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            query: {
                                type: 'string',
                                description: 'The medical topic or condition to search for. Keep it simple with 1-3 key terms for best results.',
                            },
                            source: {
                                type: 'string',
                                enum: ['medlineplus', 'statpearls', 'both'],
                                default: 'both',
                                description: 'Which source(s) to search: medlineplus, statpearls, or both',
                            },
                        },
                        required: ['query'],
                    },
                },
                {
                    name: 'fetch_medical_article',
                    description: 'Fetch and parse the full content of a medical article from MedlinePlus or StatPearls. ' +
                        'Only URLs from medlineplus.gov and ncbi.nlm.nih.gov are allowed for security. ' +
                        'This tool provides EDUCATIONAL information only - not medical advice, diagnoses, or treatment recommendations.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            url: {
                                type: 'string',
                                description: 'The URL of the medical article to fetch (must be from medlineplus.gov or ncbi.nlm.nih.gov)',
                            },
                        },
                        required: ['url'],
                    },
                },
                {
                    name: 'set_patient_profile',
                    description: 'Save patient profile information (age, weight, height, chronic conditions, medications, allergies, etc.). ' +
                        'This information is stored locally and will be used to provide more personalized medical information during consultations. ' +
                        'All fields are optional - you can provide as much or as little information as you want.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            age: {
                                type: 'number',
                                description: 'Patient age in years',
                            },
                            weight: {
                                type: 'object',
                                properties: {
                                    value: { type: 'number' },
                                    unit: { type: 'string', enum: ['kg', 'lbs'] },
                                },
                                description: 'Patient weight',
                            },
                            height: {
                                type: 'object',
                                properties: {
                                    value: { type: 'number' },
                                    unit: { type: 'string', enum: ['cm', 'in', 'ft'] },
                                },
                                description: 'Patient height',
                            },
                            sex: {
                                type: 'string',
                                enum: ['male', 'female', 'other'],
                                description: 'Biological sex',
                            },
                            chronicConditions: {
                                type: 'array',
                                items: { type: 'string' },
                                description: 'List of chronic medical conditions (e.g., diabetes, hypertension)',
                            },
                            medications: {
                                type: 'array',
                                items: { type: 'string' },
                                description: 'List of current medications',
                            },
                            allergies: {
                                type: 'array',
                                items: { type: 'string' },
                                description: 'List of allergies (medications, food, environmental)',
                            },
                            surgicalHistory: {
                                type: 'array',
                                items: { type: 'string' },
                                description: 'List of previous surgeries',
                            },
                            familyHistory: {
                                type: 'array',
                                items: { type: 'string' },
                                description: 'List of relevant family medical history',
                            },
                        },
                    },
                },
                {
                    name: 'get_patient_profile',
                    description: 'Retrieve the saved patient profile information. Returns null if no profile has been saved.',
                    inputSchema: {
                        type: 'object',
                        properties: {},
                    },
                },
                {
                    name: 'delete_patient_profile',
                    description: 'Delete the saved patient profile information.',
                    inputSchema: {
                        type: 'object',
                        properties: {},
                    },
                },
                {
                    name: 'calculate_clinical_score',
                    description: 'Calculate clinical decision rule scores to help assess disease severity, risk stratification, and guide clinical decision-making. ' +
                        'Supports multiple evidence-based calculators: CURB-65 (pneumonia severity), Centor Score (strep throat probability), Wells DVT (deep vein thrombosis risk), Wells PE (pulmonary embolism risk), HEART Score (chest pain cardiac risk), CHA2DS2-VASc (stroke risk in atrial fibrillation), GCS (Glasgow Coma Scale for consciousness assessment), qSOFA (sepsis screening), Alvarado Score (appendicitis), Glasgow-Blatchford Score (upper GI bleeding risk), NIHSS (NIH Stroke Scale for stroke severity), SOFA (Sequential Organ Failure Assessment), PERC (Pulmonary Embolism Rule-out Criteria), TIMI (Thrombolysis in Myocardial Infarction Risk Score), MELD (Model for End-Stage Liver Disease), GAD-7 (Generalized Anxiety Disorder-7). ' +
                        'These tools help determine appropriate level of care (outpatient vs hospital) and testing strategies. ' +
                        'This tool provides EDUCATIONAL information only - all clinical decisions must be made by qualified healthcare providers.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            calculator: {
                                type: 'string',
                                enum: ['curb65', 'centor', 'wells_dvt', 'wells_pe', 'heart', 'cha2ds2_vasc', 'gcs', 'qsofa', 'alvarado', 'glasgow_blatchford', 'nihss', 'sofa', 'perc', 'timi', 'meld', 'gad7'],
                                description: 'Which clinical calculator to use: curb65 (pneumonia severity/mortality risk), centor (streptococcal pharyngitis probability), wells_dvt (DVT probability), wells_pe (PE probability), heart (chest pain cardiac event risk), cha2ds2_vasc (stroke risk in atrial fibrillation), gcs (Glasgow Coma Scale for consciousness), qsofa (sepsis screening), alvarado (appendicitis risk), glasgow_blatchford (upper GI bleeding risk), nihss (NIH Stroke Scale for stroke severity), sofa (Sequential Organ Failure Assessment for ICU mortality), perc (Pulmonary Embolism Rule-out Criteria), timi (TIMI Risk Score for NSTEMI/UA), meld (Model for End-Stage Liver Disease), gad7 (Generalized Anxiety Disorder-7 for anxiety screening)',
                            },
                            inputs: {
                                type: 'object',
                                description: 'Input parameters for the selected calculator. Varies by calculator - see tool schemas for details.',
                            },
                        },
                        required: ['calculator', 'inputs'],
                    },
                },
            ],
        }));
        // Handle tool calls
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            try {
                if (name === 'search_medical_info') {
                    const validatedArgs = SearchMedicalInfoSchema.parse(args);
                    const results = await searchMedicalInfo(validatedArgs);
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(results, null, 2),
                            },
                        ],
                    };
                }
                else if (name === 'fetch_medical_article') {
                    const validatedArgs = FetchMedicalArticleSchema.parse(args);
                    const article = await fetchMedicalArticle(validatedArgs);
                    const formattedArticle = this.formatArticle(article);
                    return {
                        content: [
                            {
                                type: 'text',
                                text: formattedArticle,
                            },
                        ],
                    };
                }
                else if (name === 'set_patient_profile') {
                    const validatedArgs = SetPatientProfileSchema.parse(args);
                    const result = await setPatientProfile(validatedArgs);
                    return {
                        content: [
                            {
                                type: 'text',
                                text: result,
                            },
                        ],
                    };
                }
                else if (name === 'get_patient_profile') {
                    const profile = await getPatientProfile();
                    return {
                        content: [
                            {
                                type: 'text',
                                text: profile ? JSON.stringify(profile, null, 2) : 'No patient profile found',
                            },
                        ],
                    };
                }
                else if (name === 'delete_patient_profile') {
                    const result = await deletePatientProfile();
                    return {
                        content: [
                            {
                                type: 'text',
                                text: result,
                            },
                        ],
                    };
                }
                else if (name === 'calculate_clinical_score') {
                    const validatedArgs = CalculateClinicalScoreSchema.parse(args);
                    const result = calculateClinicalScore(validatedArgs);
                    const formattedResult = `## ${validatedArgs.calculator.toUpperCase()} Score

**Score: ${result.score}/${result.maxScore}**
**Risk Category: ${result.riskCategory}**

### Interpretation
${result.interpretation}

### Recommendation
${result.recommendation}

### Score Breakdown
${result.details}

---
*This tool provides EDUCATIONAL information only. All clinical decisions must be made by qualified healthcare providers.*`;
                    return {
                        content: [
                            {
                                type: 'text',
                                text: formattedResult,
                            },
                        ],
                    };
                }
                else {
                    throw new Error(`Unknown tool: ${name}`);
                }
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Error: ${errorMessage}`,
                        },
                    ],
                    isError: true,
                };
            }
        });
    }
    formatArticle(article) {
        let formatted = `# ${article.title}\n\n`;
        formatted += `**Source:** ${article.source}\n`;
        formatted += `**URL:** ${article.url}\n`;
        if (article.authors) {
            formatted += `**Authors:** ${article.authors}\n`;
        }
        if (article.lastUpdated) {
            formatted += `**Last Updated:** ${article.lastUpdated}\n`;
        }
        formatted += '\n---\n\n';
        for (const section of article.sections) {
            formatted += `## ${section.name}\n\n`;
            formatted += `${section.content}\n\n`;
        }
        return formatted;
    }
    setupPromptHandlers() {
        // List available prompts
        this.server.setRequestHandler(ListPromptsRequestSchema, async () => ({
            prompts: [
                {
                    name: 'diagnostic_consultation',
                    description: 'Engage in an educational medical consultation to help understand symptoms and conditions. Provides information about possible conditions and common clinical approaches, but does not prescribe treatments or provide medical advice.',
                    arguments: [
                        {
                            name: 'chief_complaint',
                            description: 'The main symptom or concern (optional - can be asked during consultation)',
                            required: false,
                        },
                    ],
                },
            ],
        }));
        // Handle prompt requests
        this.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            if (name === 'diagnostic_consultation') {
                const chiefComplaint = args?.chief_complaint;
                const profile = await loadProfile();
                const profileContext = formatProfileForPrompt(profile);
                const promptText = getDiagnosticPrompt(chiefComplaint, profileContext);
                return {
                    description: 'Medical diagnostic consultation with systematic symptom assessment',
                    messages: [
                        {
                            role: 'user',
                            content: {
                                type: 'text',
                                text: 'Help me understand my symptoms.',
                            },
                        },
                        {
                            role: 'assistant',
                            content: {
                                type: 'text',
                                text: promptText,
                            },
                        },
                    ],
                };
            }
            throw new Error(`Unknown prompt: ${name}`);
        });
    }
    setupErrorHandling() {
        this.server.onerror = (error) => {
            console.error('[MCP Error]', error);
        };
        process.on('SIGINT', async () => {
            await this.server.close();
            process.exit(0);
        });
    }
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('Doctor Claude MCP server running on stdio');
    }
}
// Start the server
const server = new DoctorClaudeServer();
server.run().catch((error) => {
    console.error('Fatal error running server:', error);
    process.exit(1);
});
