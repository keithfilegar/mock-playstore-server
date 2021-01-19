const supertest = require('supertest');
const app = require('../app');
const { expect } = require('chai');
const { forEach } = require('../playstore');

describe('GET /apps', () => {
    it('should return an array of apps', () => {
        return supertest(app)
            .get('/apps')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
            })
    })

    it('should return 400 if sort value is invalid', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'genres'})
            .expect(400, 'Sort must be one of rating or app')
    })

    it('should return 400 if genres value is invalid', () => {
        return supertest(app)
            .get('/apps')
            .query({ genres: 'INVALID'})
            .expect(400, 'Genres must be one of Action, Puzzle, Strategy, Casual, Arcade, or Card')
    })

    it('should filter based on genre', () => {
        return supertest(app)
            .get('/apps')
            .query({ genres: 'Casual' })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');

                let filtered = true;

                for(i = 0; i < res.body.length; i++) {
                    if(!res.body[i].genres.includes('Casual')) {
                        filtered = false;
                        break;
                    }
                }
                expect(filtered).to.be.true;
            })
    })

    it('should sort on valid sort param', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'rating' })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array')

                let sorted = true;

                let i = 0;

                while(i < res.body.length -1) {
                    const appAtI = res.body[i];
                    const appAtIPlus1 = res.body[i + 1];

                    if(appAtIPlus1.rating < appAtI.rating) {
                        sorted = false;
                        break;
                    }
                    i++
                }
                expect(sorted).to.be.true;
            })
    })
})