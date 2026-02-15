import React from "react";
import ReactDOM from "react-dom/client"
import './app.css'

const App = () => {
    const callBackend = async () => {
        try {
            const res = await fetch("http://localhost:8080")
            const data = await res.text()
            console.log(data);
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div>
            <h1 className="font-bold text-xl bg-green-500 font-mono">Webpack + React + TS</h1>
            <button onClick={callBackend}>Call Backend</button>
        </div>
    )
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
)