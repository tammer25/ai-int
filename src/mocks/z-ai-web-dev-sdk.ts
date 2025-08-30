/**
 * Mock implementation of z-ai-web-dev-sdk
 * This is a stub module to allow builds to succeed without the real SDK
 */

// Mock chat completion response interface
interface ChatCompletionChoice {
  message?: {
    content?: string;
  };
}

interface ChatCompletionResponse {
  choices: ChatCompletionChoice[];
}

// Mock chat completions interface
interface ChatCompletions {
  create(params: any): Promise<ChatCompletionResponse>;
}

// Mock chat interface
interface Chat {
  completions: ChatCompletions;
}

// Mock ZAI class
class MockZAI {
  public chat: Chat;

  constructor() {
    this.chat = {
      completions: {
        async create(params: any): Promise<ChatCompletionResponse> {
          // Return a mock response that mimics the expected structure
          return {
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    title: 'Mock Response',
                    description: 'This is a mock response from the stub SDK',
                    message: 'The real z-ai-web-dev-sdk is not available in this environment'
                  })
                }
              }
            ]
          };
        }
      }
    };
  }

  static async create(): Promise<MockZAI> {
    return new MockZAI();
  }
}

// Default export to match the expected import pattern
const ZAI = MockZAI;
export default ZAI;
