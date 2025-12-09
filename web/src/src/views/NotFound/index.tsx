import { ErrorPage } from '../../components/ErrorPage';

const NotFound = () => {
    const handleGoBack = () => {
        window.history.back();
    };

    return (
        <div className="p-8">
            <ErrorPage
                code={404}
                heading={'Page Not Found'}
                content={'The page you are looking for does not exist.'}
                action={{
                    onClick: handleGoBack,
                    label: 'Go Back'
                }}
            />
        </div>
    );
};

export default NotFound;
