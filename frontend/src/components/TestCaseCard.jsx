import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, FileText, List, ArrowRight } from 'lucide-react';

const TestCaseCard = ({ testCase }) => {
    const getPriorityColor = (p) => {
        switch (p?.toLowerCase()) {
            case 'high': return '#ff4d4d';
            case 'medium': return '#ffaa00';
            case 'low': return '#00cc66';
            default: return '#777';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel"
            style={{ padding: '1.5rem', marginBottom: '1rem', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}
        >
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: getPriorityColor(testCase.priority) }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>{testCase.id}: {testCase.title}</h3>
                <span style={{
                    fontSize: '0.8rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '20px',
                    background: `${getPriorityColor(testCase.priority)}33`,
                    color: getPriorityColor(testCase.priority),
                    border: `1px solid ${getPriorityColor(testCase.priority)}`
                }}>
                    {testCase.priority}
                </span>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                {testCase.description}
            </p>

            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                {/* Preconditions */}
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent-secondary)' }}>
                        <AlertCircle size={16} />
                        <strong style={{ fontSize: '0.9rem' }}>Pre-Conditions</strong>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem', color: '#ccc' }}>
                        {testCase.preConditions?.map((pc, i) => <li key={i}>{pc}</li>)}
                    </ul>
                </div>

                {/* Expected Result */}
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>
                        <CheckCircle size={16} />
                        <strong style={{ fontSize: '0.9rem' }}>Expected Result</strong>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#ccc' }}>{testCase.expectedResult}</p>
                </div>
            </div>

            {/* Steps */}
            <div style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <List size={16} />
                    <strong style={{ fontSize: '0.9rem' }}>Test Steps</strong>
                </div>
                <ol style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem', color: '#ddd' }}>
                    {testCase.steps?.map((step, i) => (
                        <li key={i} style={{ marginBottom: '0.4rem' }}>{step}</li>
                    ))}
                </ol>
            </div>

        </motion.div>
    );
};

export default TestCaseCard;
