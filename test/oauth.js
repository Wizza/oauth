var chai    = require('chai'),
    should  = chai.should(),
    assert  = chai.assert,
    expect  = chai.expect;

var request = require('request');
    

describe('Request access response', function(){
    this.timeout(150000);
    
    var token;
    
    it('should return an access_token', function(done){
        request.post('http://localhost:3000/oauth/token', function(err, res, body){
            token = JSON.parse(body);
            console.log(token)
            expect(token).to.have.property('access_token');
            
            done();
        }).form({      
            username: 'joe',
            password: 'password',
            grant_type: 'password',
            
            client_id: 's6BhdRkqt3',
            client_secret: '8sdg578sd5g78sd5g8'    
        });
    });
    
    it('should have access to secure url', function(done){
        var options = {
            url: 'http://localhost:3000/secure',
            headers: {
                'Authorization': 'Bearer ' + token.access_token
            }
        };
        
        request.get(options, function(err, res, body){
            var response = JSON.parse(body);
            
            expect(response.code).to.equal(200);
            
            done();
        });
    });
    
    it('should be unauthorized to secure url', function(done){
        var options = {
            url: 'http://localhost:3000/secure',
            headers: {
                'Authorization': 'Bearer Invalid'
            }
        };
        
        request.get(options, function(err, res, body){
            var response = JSON.parse(body);
            
            expect(response.code).to.equal(401);
            
            done();
        });
    });
    
    it('The access token provided should have expired', function(done){
        setTimeout(function(){
            var options = {
                url: 'http://localhost:3000/secure',
                headers: {
                    'Authorization': 'Bearer ' + token.access_token
                }
            };

            request.get(options, function(err, res, body){
                var response = JSON.parse(body);
                
                expect(response.code).to.equal(401);

                done();
            });
        }, 6000);

    });
    
    it('Make a request with the refresh token for a new access token', function(done){

        request.post('http://localhost:3000/oauth/token', function(err, res, body){
            token = JSON.parse(body);
            
            console.log(token);
            
            expect(token).to.have.property('access_token');
            
            done();
        }).form({      
            grant_type: 'refresh_token',
            client_id: 's6BhdRkqt3',
            client_secret: '8sdg578sd5g78sd5g8',
            refresh_token: token.refresh_token
        });
        
        

    });
     
});