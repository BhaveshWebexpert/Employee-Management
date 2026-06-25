import 'dotenv/config'

const config = {
    connectionURL : process.env.DB_URL,
    jwtToken : process.env.JWT_SECRET,
    port : process.env.PORT,
};

export default config;