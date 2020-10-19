import 'bootstrap/dist/css/bootstrap.css';
import Header from '../components/header';
import buildClient from '../api/build-client';


const App = ({ Component, pageProps, currentUser }) => {
    return (

        <div>
            <Header currentUser={currentUser} />
            <div className="container">
                <Component {...pageProps} currentUser={currentUser} />
            </div>
        </div>
    );
}

App.getInitialProps = async (appContext) => { //appTree, Component, Router, ctx
    const client = buildClient(appContext.ctx);
    const { data } = await client.get('/api/users/currentuser');


    let pageProps = {};
    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser);
    }


    return {
        pageProps,
        ...data,
    };
}

export default App;