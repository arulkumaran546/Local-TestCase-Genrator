import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { generateTestCases } from '../services/ollamaService';
import TestCaseCard from './TestCaseCard';
import { motion } from 'framer-motion';

const MessageBubble = ({ message }) => {
    const isUser = message.role === 'user';

    return (
        <motion.div
            initial={{ opacity: 0, x: isUser ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
                display: 'flex',
                justifyContent: isUser ? 'flex-end' : 'flex-start',
                marginBottom: '1.5rem',
                padding: '0 1rem'
            }}
        >
            <div style={{ display: 'flex', gap: '1rem', flexDirection: isUser ? 'row-reverse' : 'row', maxWidth: '800px', width: '100%' }}>

                {/* Avatar */}
                <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: isUser ? 'var(--accent-secondary)' : 'var(--accent-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                }}>
                    {isUser ? <User size={20} color="#000" /> : <Bot size={20} color="#fff" />}
                </div>

                {/* Content */}
                <div className={!isUser && message.content.testCases ? '' : 'glass-panel'}
                    style={{
                        padding: message.content.testCases ? '0' : '1rem 1.5rem',
                        borderRadius: '16px',
                        borderTopLeftRadius: isUser ? '16px' : '4px',
                        borderTopRightRadius: isUser ? '4px' : '16px',
                        background: isUser ? 'hsla(var(--accent-secondary), 0.15)' : undefined,
                        borderColor: isUser ? 'hsla(var(--accent-secondary), 0.3)' : undefined,
                        width: message.content.testCases ? '100%' : 'auto',
                        boxShadow: message.content.testCases ? 'none' : undefined,
                        backdropFilter: message.content.testCases ? 'none' : undefined,
                        border: message.content.testCases ? 'none' : undefined,
                    }}>

                    {typeof message.content === 'string' ? (
                        <p style={{ margin: 0, lineHeight: 1.5 }}>{message.content}</p>
                    ) : (
                        <div>
                            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)' }}>
                                <Sparkles size={18} />
                                <span>Generated Test Cases</span>
                            </div>
                            {message.content.testCases?.map((tc, i) => (
                                <TestCaseCard key={i} testCase={tc} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

const ChatInterface = () => {
    const [messages, setMessages] = useState([
        { role: 'system', content: "Hello! I'm BLAST. Describe a feature, and I'll generate comprehensive test cases for you." }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const result = await generateTestCases(input);
            const systemMsg = { role: 'system', content: result };
            setMessages(prev => [...prev, systemMsg]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'system', content: `Error: ${error.message}. Is Ollama running?` }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', maxWidth: '1000px', margin: '0 auto' }}>
            {/* Header */}
            <header className="glass-panel" style={{
                margin: '1rem', padding: '1rem 2rem', borderRadius: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10
            }}>
                <h1 style={{ margin: 0, fontSize: '1.5rem', background: 'linear-gradient(to right, #00f0ff, #bd00ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    B.L.A.S.T. Generator
                </h1>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00cc66', boxShadow: '0 0 10px #00cc66' }}></div>
                    <span style={{ fontSize: '0.8rem', color: '#aaa' }}>Ollama Connected</span>
                </div>
            </header>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '1rem' }}>
                {messages.map((m, i) => <MessageBubble key={i} message={m} />)}

                {loading && (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            style={{ width: '30px', height: '30px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%' }}
                        />
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div style={{ padding: '0 1rem 2rem 1rem' }}>
                <div className="glass-panel" style={{ padding: '0.5rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                        className="glass-input"
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Describe your feature (e.g., 'Login Page with Google Auth')..."
                        style={{
                            flex: 1, padding: '1rem 1.5rem', borderRadius: '40px', border: 'none', background: 'transparent'
                        }}
                    />
                    <button
                        className="glass-btn"
                        onClick={handleSend}
                        style={{
                            width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                        }}
                    >
                        <Send size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
