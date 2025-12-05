declare module 'mailgun.js' {
  import FormData from 'form-data';

  export interface MailgunOptions {
    apiKey: string;
    domain: string;
    username?: string; // Propriedade opcional 'username'
    key: string; // Adicionando a propriedade 'key'
  }

  export interface MessageData {
    from: string;
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
  }

  export interface MailgunClient {
    messages(): {
      send(data: MessageData): Promise<any>;
    };
  }

  export default function Mailgun(formData: typeof FormData): {
    client(options: MailgunOptions): MailgunClient;
  };
}
