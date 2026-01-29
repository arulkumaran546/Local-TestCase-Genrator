import { useState } from 'react'
import { Play, FileCode, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import './index.css'

function App() {
    const [sourceCode, setSourceCode] = useState('')
    const [convertedCode, setConvertedCode] = useState('')
    const [logs, setLogs] = useState<{ msg: string, type: 'info' | 'success' | 'error' }[]>([])
    const [isConverting, setIsConverting] = useState(false)

    const addLog = (msg: string, type: 'info' | 'success' | 'error' = 'info') => {
        setLogs(prev => [...prev.slice(-10), { msg, type }])
    }

    const handleConvert = async () => {
        if (!sourceCode.trim()) {
            addLog('Please enter Selenium code first', 'error')
            return
        }

        setIsConverting(true)
        addLog('Starting conversion using CodeLlama...', 'info')

        try {
            const response = await fetch('/api/convert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    source_code: sourceCode,
                    target_language: 'typescript'
                })
            })

            const data = await response.json()

            if (data.status === 'success') {
                setConvertedCode(data.converted_code)
                addLog('Conversion successful!', 'success')
                if (data.file_path) {
                    addLog(`File saved to: ${data.file_path}`, 'info')
                }
            } else {
                addLog(data.detail || 'Conversion failed', 'error')
            }
        } catch (err) {
            addLog('Error connecting to backend: ' + (err as Error).message, 'error')
        } finally {
            setIsConverting(false)
        }
    }

    return (
        <div className="app-container">
            <header>
                <h1>B.L.A.S.T. Converter</h1>
                <p>Selenium Java to Playwright TS (Powered by CodeLlama)</p>
            </header>

            <div className="main-grid">
                <div className="editor-box">
                    <div className="flex justify-between items-center">
                        <h2>Source: Selenium Java</h2>
                        <FileCode size={20} color="#64748b" />
                    </div>
                    <textarea
                        value={sourceCode}
                        onChange={(e) => setSourceCode(e.target.value)}
                        placeholder="Paste your Selenium Java code here..."
                    />
                </div>

                <div className="editor-box">
                    <div className="flex justify-between items-center">
                        <h2>Result: Playwright TS</h2>
                        <CheckCircle size={20} color="#64748b" />
                    </div>
                    <textarea
                        value={convertedCode}
                        readOnly
                        placeholder="Converted code will appear here..."
                    />
                </div>
            </div>

            <button
                className="convert-button"
                onClick={handleConvert}
                disabled={isConverting}
            >
                {isConverting ? (
                    <>
                        <Loader2 className="animate-spin" />
                        Converting...
                    </>
                ) : (
                    <>
                        <Play fill="currentColor" />
                        Convert Tests
                    </>
                )}
            </button>

            <div className="logs-container">
                {logs.length === 0 && <div className="log-entry">Waiting for input...</div>}
                {logs.map((log, i) => (
                    <div key={i} className={`log-entry ${log.type}`}>
                        {log.type === 'error' && <AlertCircle size={14} style={{ display: 'inline', marginRight: '5px' }} />}
                        [{new Date().toLocaleTimeString()}] {log.msg}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default App
