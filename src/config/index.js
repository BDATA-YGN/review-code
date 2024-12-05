const currentEnvironment = 2; // 1 for dev, 2 for demo, 3 for production

export const URL =
  currentEnvironment === 1
    ? 'https://dev.myspace-mm.com/'
    : currentEnvironment === 2
    ? 'https://demo.myspace-mm.com/'
    : 'https://myspace.com.mm/';

export const SERVER_KEY = '0f2d83c4ced011744f35438c19be4f70';
// export const SERVER_KEY =
//   'ca6316b2eccf0a648230f93d51a8808f73e366d9-39889499f3bfdaa964aad4dc4e601144-81935725';
