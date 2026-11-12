# frozen_string_literal: true
require 'sinatra'
require 'json'
require 'rack/cors'

set :port, 4567
set :bind, '0.0.0.0'

use Rack::Cors do
  allow do
    origins '*'
    resource '*', headers: :any, methods: %i[get post options]
  end
end

before do
  content_type :json
end

REVIEWS_DB = [
  {
    id: "rev-ruby-1",
    author: "Siddharth Rao",
    designation: "VP, Enterprise Cloud",
    rating: 5.0,
    metrics: { cleanliness: 5.0, hospitality: 5.0, food: 4.9, location: 5.0, value: 4.9 },
    text: "Having 100 acres completely to ourselves 15 minutes from Cyber Towers was unreal. Unmatched agritourism and luxury in Hyderabad.",
    verified: true
  },
  {
    id: "rev-ruby-2",
    author: "Ananya & Rohan Kulkarni",
    designation: "Pre-Wedding Hosts",
    rating: 5.0,
    metrics: { cleanliness: 5.0, hospitality: 5.0, food: 5.0, location: 5.0, value: 5.0 },
    text: "The combination of the modern luxury mansion with the rock waterfall and 25 acres of blooming flowers gave us shots that look like Tuscany and Bali combined!",
    verified: true
  }
]

get '/api/v1/health' do
  {
    status: 'HEALTHY',
    service: 'Jai Krishna Ram Ruby Reviews & Sentiment Engine',
    framework: 'Sinatra/Ruby',
    timestamp: Time.now.utc.isoformat
  }.to_json
end

get '/api/v1/reviews' do
  {
    success: true,
    averageRating: 4.95,
    totalReviews: 1420,
    reviews: REVIEWS_DB
  }.to_json
end

