import cors, { CorsOptionsDelegate } from 'cors';

const configureCors = (): CorsOptionsDelegate => {
  return (req, callback) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:5500'
    ];

    const corsOptions = {
      origin: (origin: string | undefined, cb: (err: Error | null, allow?: boolean) => void) => {
        if (!origin || allowedOrigins.includes(origin)) {
          cb(null, true);
        } else {
          cb(new Error('Not allowed by CORS'));
        }
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Accept-Version',
        // HTMX headers
        'HX-Request',
        'HX-Trigger',
        'HX-Target',
        'HX-Current-URL',  // ADD THIS - note the hyphen
        'hx-current-url',  // AND THIS for lowercase version
      ],
      exposedHeaders: [
        'X-Total-Count',
        'Content-Range'
      ],
      credentials: true,
      preflightContinue: false,
      maxAge: 600,
      optionsSuccessStatus: 204
    };

    callback(null, corsOptions);
  };
};

export { configureCors };