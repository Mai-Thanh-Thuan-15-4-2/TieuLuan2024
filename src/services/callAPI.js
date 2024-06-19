
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
    async fetchAdditionalQuestions() {
        try {
            const response = await fetch(`${this.baseUrl}/additionalQuestions`);
            if (!response.ok) {
                throw new Error('Failed to fetch additional questions');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching additional questions:', error);
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
    async addQuestion(subjectId, question) {
        try {
            const response = await fetch(`${this.baseUrl}/${subjectId}/addQuestion`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(question)
            });

            if (!response.ok) {
                throw new Error(`Failed to add question to subject with ID ${subjectId}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error adding question:', error);
            throw error;
        }
    }
    async addQuestionAccount(accountId, questionId, subjectId) {
        try {
            const response = await fetch(`${this.baseUrl}/${accountId}/${subjectId}/addQuestionAccount`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ questionId }),
            });
            return await response.json();
        } catch (error) {
            console.error('Error adding question:', error);
            if (error.response && error.response.status === 500) {
                throw new Error('Internal server error');
            }
        }
    }
    async removeQuestionFromAccount(accountId, questionId, subjectId) {
        try {
            const response = await fetch(`${this.baseUrl}/${accountId}/${subjectId}/removeQuestionAccount`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ questionId }),
            });
            return await response.json();
        } catch (error) {
            console.error('Error removing question:', error);
            if (error.response && error.response.status === 500) {
                throw new Error('Internal server error');
            } else {
                throw error;
            }
        }
    }
    async addSubjectToAccount(accountId, subjectId) {
        try {
            const response = await fetch(`${this.baseUrl}/${accountId}/addSubjectToAccount`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idSub: subjectId }),
            });
            return await response.json();
        } catch (error) {
            console.error('Error adding subject to account:', error);
            if (error.response && error.response.status === 500) {
                throw new Error('Internal server error');
            } else {
                throw error;
            }
        }
    }    
    async addQuestionsToAccount(accountId, questionIds, subjectId) {
        try {
            const response = await fetch(`${this.baseUrl}/${accountId}/${subjectId}/addQuestionsToAccount`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ questionIds }),
            });
            return await response.json();
        } catch (error) {
            console.error('Error adding questions to account:', error);
            if (error.response && error.response.status === 500) {
                throw new Error('Internal server error');
            } else {
                throw error;
            }
        }
    }
    async addExam(accountId, exam) {
        try {
            const response = await fetch(`${this.baseUrl}/accounts/${accountId}/addExam`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(exam),
            });
            return await response.json();
        } catch (error) {
            console.error('Error adding exam:', error);
            throw error;
        }
    }
    async updateQuestion(subjectId, questionId, status) {
        try {
            const response = await fetch(`${this.baseUrl}/courses/${subjectId}/questions`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idQuestion: questionId, status: status }),
            });
            return await response.json();
        } catch (error) {
            console.error('Error removing question:', error);
            throw error;
        }
    }
    async removeQuestionPermanently(subjectId, questionId) {
        try {
            const response = await fetch(`${this.baseUrl}/courses/${subjectId}/deleteQuestions`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idQuestion: questionId}),
            });
            return await response.json();
        } catch (error) {
            console.error('Error removing question:', error);
            throw error;
        }
    }
    async removeSubjectFromAccount(accountId, subjectId) {
        try {
            const response = await fetch(`${this.baseUrl}/${accountId}/removeSubjectFromAccount`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ subjectId }),
            });
            return await response.json();
        } catch (error) {
            console.error('Error removing subject from account:', error);
            if (error.response && error.response.status === 500) {
                throw new Error('Internal server error');
            } else {
                throw error;
            }
        }
    }
    async checkLogin(username, password) {
        try {
          const response = await fetch(`${this.baseUrl}/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
          });
          return await response.json();
        } catch (error) {
          console.error('Error checking login:', error);
          throw error;
        }
      }
      async getUserInfo(token) {
        try {
            const response = await fetch(`${this.baseUrl}/getuserinfo`, {
                method: 'GET',
                headers: {
                    'token': `${token}`
                  }                  
              });
            if (!response.ok) {
                throw new Error('Failed to get user info');
            }
            return await response.json();
        } catch (error) {
            console.error('Error getting user info:', error);
            throw error;
        }
      }
    async updateStatusExam(accountId, idExam, status) {
        try {
            const response = await fetch(`${this.baseUrl}/${accountId}/updateStatusExam`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idExam, status }),
            });
            return await response.json();
        } catch (error) {
            console.error('Error updating exam status:', error);
            if (error.response && error.response.status === 500) {
                throw new Error('Internal server error');
            } else {
                throw error;
            }
        }
    }
    async deleteExam(accountId, idExam) {
        try {
            const response = await fetch(`${this.baseUrl}/${accountId}/deleteExam`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idExam }),
            });
            return await response.json();
        } catch (error) {
            console.error('Error deleting exam:', error);
            if (error.response && error.response.status === 500) {
                throw new Error('Internal server error');
            } else {
                throw error;
            }
        }
    }
    async updateStatusSubjectFromAccount(idAccount, idSubject, newStatus) {
        try {
          const response = await fetch(`${this.baseUrl}/${idAccount}/updateSubjectStatus`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idSubject, newStatus }),
          });
          return await response.json();
        } catch (error) {
          console.error('Error updating subject status:', error);
          if (error.response && error.response.status === 500) {
            throw new Error('Internal server error');
          } else {
            throw error;
          }
        }
      }
}

export default callAPI;
