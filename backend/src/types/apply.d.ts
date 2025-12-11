export interface ApplyInput {
  name: string;
  email: string;
  file: {
    path: string;
    originalName?: string;
    size?: number;
    mimeType?: string;
  };
}
