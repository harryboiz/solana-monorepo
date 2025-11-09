'use client';

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
    const [block, setBlock] = useState('');
    const [count, setCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchTxCount = async () => {
        if (!block) return;
        setLoading(true);
        setError('');
        try {
            const res = await axios.get('http://localhost:3001/solana/block/tx-count', {
                params: { block },
            });
            setCount(res.data.transactionCount);
        } catch (err: any) {
            console.error(err);
            setCount(null);
            setError(err?.response?.data?.message || 'Failed to fetch');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Solana Block Transaction Count</h1>
            <input
                type="number"
                value={block}
                onChange={(e) => setBlock(e.target.value)}
                placeholder="Enter block number"
                style={{ marginRight: '1rem', padding: '0.5rem' }}
            />
            <button onClick={fetchTxCount} disabled={loading} style={{ padding: '0.5rem 1rem' }}>
                {loading ? 'Loading...' : 'Get Count'}
            </button>
            {count !== null && !error && <p>Transactions in block {block}: {count}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}
