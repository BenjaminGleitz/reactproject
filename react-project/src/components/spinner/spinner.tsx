import './spinner.css';
export default function Spinner() {

    return (
        <div className="overlay">
            <div className="spinner-container">
                <div className="loading-spinner"></div>
            </div>
        </div>
    );
}
