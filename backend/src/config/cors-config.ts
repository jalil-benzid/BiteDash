import cors, { CorsOptionsDelegate } from 'cors';

const configureCors = (): CorsOptionsDelegate => {
  return (req, callback) => {
    const allowedOrigins = [
      'http://localhost:3000',
    ];

    const corsOptions = {
      origin: (origin: string | undefined, cb: (err: Error | null, allow?: boolean) => void) => {
        if (!origin || allowedOrigins.includes(origin)) {
          cb(null, true);
        } else {
          cb(new Error('Not allowed by CORS'));
        }
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Accept-Version'
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