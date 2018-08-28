import dotenv from 'dotenv';

dotenv.config();

export default {
  secret:
        process.env.NODE_ENV === 'production' ? process.env.SECRET : 'secret'
};
