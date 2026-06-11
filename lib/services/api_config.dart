class ApiConfig {
  static const String baseUrl = 'https://hogicar-backend.onrender.com';
  static const Duration connectTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);
  
  // Endpoints
  static const String login = '/api/auth/login';
  static const String register = '/api/auth/register';
  static const String profile = '/api/user/profile';
  static const String searchLocations = '/api/public/locations/search';
  static const String allLocations = '/api/public/locations';
  static const String searchCars = '/api/public/search';
  static const String carDetails = '/api/public/cars';
  static const String insurance = '/api/public/insurance';
  static const String extras = '/api/public/extras';
  static const String createBooking = '/api/bookings';
  static const String myBookings = '/api/bookings';
  static const String lookupBooking = '/api/bookings/lookup';
}
