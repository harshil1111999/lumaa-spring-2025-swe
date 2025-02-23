import express from 'express';
import { pool } from '../config/database';
import { authenticateToken } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = express.Router();

router.get('/', authenticateToken, async (req: any, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
            [req.user?.id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Error fetching tasks' });
    }
});

router.post('/', authenticateToken, async (req: any, res) => {
    const { title, description } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO tasks (title, description, is_complete, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, description, false, req.user?.id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Error creating task' });
    }
});

router.put('/:id', authenticateToken, async (req: any, res) => {
    const { id } = req.params;
    const { title, description, isComplete } = req.body;

    try {
        const result = await pool.query(
            'UPDATE tasks SET title = $1, description = $2, is_complete = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 AND user_id = $5 RETURNING *',
            [title, description, isComplete, id, req.user?.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Error updating task' });
    }
});

router.delete('/:id', authenticateToken, async (req: any, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, req.user?.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Error deleting task' });
    }
});

export default router;