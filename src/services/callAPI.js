
class callAPI {
    constructor() {
        this.baseUrl = 'http://localhost:4000/api';
    }

    async fetchHeader() {
        try {
            const response = await fetch(`${this.baseUrl}/header`);
            if (!response.ok) {
                throw new Error('Failed to fetch header');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching header:', error);
            throw error;
        }
    }

    async fetchMainExams() {
        try {
            const response = await fetch(`${this.baseUrl}/mainExams`);
            if (!response.ok) {
                throw new Error('Failed to fetch main exams');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching main exams:', error);
            throw error;
        }
    }

    async fetchBasicExams() {
        try {
            const response = await fetch(`${this.baseUrl}/basicExams`);
            if (!response.ok) {
                throw new Error('Failed to fetch basic exams');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching basic exams:', error);
            throw error;
        }
    }
    async getAccountById(accountId) {
        try {
            const response = await fetch(`${this.baseUrl}/accounts/${accountId}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch account with ID ${accountId}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching account by ID:`, error);
            throw error;
        }
    }
    async updateContentStateById(id, id_exam, newBlocks) {
        try {
            const response = await fetch(`${this.baseUrl}/${id}/edit_exams/${id_exam}/contentState`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ blocks: newBlocks })
            });

            if (!response.ok) {
                throw new Error(`Failed to update content state for exam with ID ${id_exam}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating content state:', error);
            throw error;
        }
    }
}

export default callAPI;
