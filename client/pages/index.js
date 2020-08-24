import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
    console.log(currentUser);
    return (
        <h1>Hello world....</h1>
    );
}


LandingPage.getInitialProps = async (ctx) => {
    const client = buildClient(ctx);
    const { data } = await client.get('/api/users/currentuser');
    return data; 
}

export default LandingPage;