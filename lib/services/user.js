'use strict';

const crypto = require('crypto');
const { Service } = require('@hapipal/schmervice'); 
const Boom = require('@hapi/boom');
const Jwt = require('@hapi/jwt');

function sha1(password) {
     const hash = crypto.createHash('sha1');
     hash.update(password);
     return hash.digest('hex');
}

module.exports = class UserService extends Service {
     async create(user) {
          const { User } = this.server.models();
          user.password = sha1(user.password);
          return await User.query().insertAndFetch(user);
     }

     async list() {
          const { User } = this.server.models();
          return await User.query();
     }

     async getById(id) {
          const { User } = this.server.models();
          return await User.query().findById(id);
     }

     async delete(id) {
          const { User } = this.server.models();
          return await User.query().deleteById(id);
     }

     async update(id, user) {
          const { User } = this.server.models();
          return await User.query().findById(id).patch(user);
     }

     async login(email, password) {
          const { User } = this.server.models();
          const user = await User.query().findOne({ email });

          if (!user || user.password !== sha1(password)) {
               throw Boom.unauthorized('Invalid credentials');
          }

          const token = Jwt.token.generate(
               {
                    aud: 'urn:audience:iut',
                    iss: 'urn:issuer:iut',
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    scope: user.scopes
               },
               {
                    key: 'random_string', // La clé qui est définit dans lib/auth/strategies/jwt.js
                    algorithm: 'HS512'
               },
               {
                    ttlSec: 14400 // 4 hours
               }
          );

          return token;
     }
}
