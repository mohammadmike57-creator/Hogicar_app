import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../models/car.dart';
import '../models/booking.dart';
import '../models/user_profile.dart';
import '../models/location_suggestion.dart';
import 'api_config.dart';

class ApiService {
  final _storage = const FlutterSecureStorage();

  Future<Map<String, String>> _getHeaders() async {
    final token = await _storage.read(key: 'jwt_token');
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  Future<dynamic> _handleResponse(http.Response response) async {
    if (response.statusCode == 401) {
      await _storage.delete(key: 'jwt_token');
    }

    if (response.statusCode >= 200 && response.statusCode < 300) {
      if (response.body.isEmpty) return null;
      return json.decode(response.body);
    } else {
      throw Exception('Request failed with status: ${response.statusCode}');
    }
  }

  // Auth
  Future<UserProfile?> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.login}'),
        headers: await _getHeaders(),
        body: json.encode({'email': email, 'password': password}),
      );

      final data = await _handleResponse(response);
      if (data != null) {
        if (data['token'] != null) {
          await _storage.write(key: 'jwt_token', value: data['token']);
        }
        return UserProfile.fromJson(data['user']);
      }
    } catch (e) {
      print('Login error: $e');
    }
    return null;
  }

  Future<UserProfile?> register(Map<String, dynamic> userData) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.register}'),
        headers: await _getHeaders(),
        body: json.encode(userData),
      );

      final data = await _handleResponse(response);
      if (data != null) {
        if (data['token'] != null) {
          await _storage.write(key: 'jwt_token', value: data['token']);
        }
        return UserProfile.fromJson(data['user']);
      }
    } catch (e) {
      print('Register error: $e');
    }
    return null;
  }

  Future<UserProfile?> getProfile() async {
    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.profile}'),
        headers: await _getHeaders(),
      );
      final data = await _handleResponse(response);
      if (data != null) {
        return UserProfile.fromJson(data);
      }
    } catch (e) {
      print('Get profile error: $e');
    }
    return null;
  }

  // Locations
  Future<List<LocationSuggestion>> searchLocations(String query) async {
    if (query.length < 2) return [];
    
    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.searchLocations}?q=${Uri.encodeComponent(query)}'),
        headers: await _getHeaders(),
      );

      final data = await _handleResponse(response);
      if (data != null && data is List) {
        final results = data.map((json) => LocationSuggestion.fromJson(json)).toList();
        
        final Map<String, LocationSuggestion> uniqueMap = {};
        for (var loc in results) {
          uniqueMap[loc.label] = loc;
        }
        return uniqueMap.values.toList();
      }
    } catch (e) {
      print('Error fetching locations: $e');
    }
    return [];
  }

  Future<List<LocationSuggestion>> getAllLocations() async {
    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.allLocations}'),
        headers: await _getHeaders(),
      );
      final data = await _handleResponse(response);
      if (data != null && data is List) {
        final results = data.map((json) => LocationSuggestion.fromJson(json)).toList();
        
        final Map<String, LocationSuggestion> uniqueMap = {};
        for (var loc in results) {
          uniqueMap[loc.label] = loc;
        }
        return uniqueMap.values.toList();
      }
    } catch (e) {
      print('Error fetching all locations: $e');
    }
    return [];
  }

  // Suppliers
  Future<List<dynamic>> getSuppliersByLocation(String? locationCode) async {
    try {
      String url = '${ApiConfig.baseUrl}/api/public/suppliers';
      if (locationCode != null) url += '?locationCode=${Uri.encodeComponent(locationCode)}';
      
      final response = await http.get(Uri.parse(url), headers: await _getHeaders());
      return await _handleResponse(response) ?? [];
    } catch (e) {
      print('Error fetching suppliers: $e');
    }
    return [];
  }

  // Search Cars
  Future<List<Car>> searchCars({
    required String pickup,
    String? dropoff,
    required String pickupDate,
    required String dropoffDate,
    String? startTime,
    String? endTime,
  }) async {
    try {
      final Map<String, String> params = {
        'pickup': pickup,
        'pickupDate': pickupDate,
        'dropoffDate': dropoffDate,
      };
      if (dropoff != null && dropoff.isNotEmpty && dropoff != pickup) params['dropoff'] = dropoff;
      if (startTime != null) params['startTime'] = startTime;
      if (endTime != null) params['endTime'] = endTime;

      final query = params.entries.map((e) => '${e.key}=${Uri.encodeComponent(e.value)}').join('&');
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.searchCars}?$query'),
        headers: await _getHeaders(),
      );

      final data = await _handleResponse(response);
      if (data != null && data is List) {
        final List<Car> cars = data.map((json) => Car.fromJson(json)).toList();
        final List<Car> finalCars = [];
        
        for (var car in cars) {
          // Original car should NOT be branded as Hogi Car Choice in the UI
          finalCars.add(car.copyWith(isHogicarChoiceBranded: false));
          
          if (car.isHogicarChoice && car.rentalCompany != 'Hogi Car Choice') {
            finalCars.add(car.copyWith(
              id: 'choice-${car.id}',
              rentalCompany: 'Hogi Car Choice',
              rentalCompanyLogo: 'HOGICAR_CHOICE_LOGO',
              isHogicarChoice: true,
              isHogicarChoiceBranded: true,
            ));
          }
        }
        return finalCars;
      }
    } catch (e) {
      print('Error searching cars: $e');
    }
    return [];
  }

  Future<Car?> getCarDetails(String carId) async {
    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.carDetails}/$carId'),
        headers: await _getHeaders(),
      );
      final data = await _handleResponse(response);
      if (data != null) {
        return Car.fromJson(data);
      }
    } catch (e) {
      print('Error getting car details: $e');
    }
    return null;
  }

  // Bookings
  Future<Booking?> createBooking(Map<String, dynamic> bookingData) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.createBooking}'),
        headers: await _getHeaders(),
        body: json.encode(bookingData),
      );

      final data = await _handleResponse(response);
      if (data != null) {
        return Booking.fromJson(data);
      }
    } catch (e) {
      print('Error creating booking: $e');
    }
    return null;
  }

  Future<Booking?> lookupBooking(String email, String ref) async {
    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.lookupBooking}?email=${Uri.encodeComponent(email)}&ref=${Uri.encodeComponent(ref)}'),
        headers: await _getHeaders(),
      );

      final data = await _handleResponse(response);
      if (data != null) {
        return Booking.fromJson(data);
      }
    } catch (e) {
      print('Error looking up booking: $e');
    }
    return null;
  }

  Future<Booking?> getBooking(String id) async {
    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.createBooking}/$id'),
        headers: await _getHeaders(),
      );
      final data = await _handleResponse(response);
      if (data != null) {
        return Booking.fromJson(data);
      }
    } catch (e) {
      print('Error getting booking: $e');
    }
    return null;
  }

  Future<Booking?> getBookingByRef(String ref) async {
    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.createBooking}/ref/$ref'),
        headers: await _getHeaders(),
      );
      final data = await _handleResponse(response);
      if (data != null) {
        return Booking.fromJson(data);
      }
    } catch (e) {
      print('Error getting booking by ref: $e');
    }
    return null;
  }

  Future<Booking?> cancelBooking(String id) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.createBooking}/$id/cancel'),
        headers: await _getHeaders(),
      );
      final data = await _handleResponse(response);
      if (data != null) {
        return Booking.fromJson(data);
      }
    } catch (e) {
      print('Error cancelling booking: $e');
    }
    return null;
  }

  Future<dynamic> requestModification(String id, Map<String, dynamic> data) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.createBooking}/$id/modification/request'),
        headers: await _getHeaders(),
        body: json.encode(data),
      );
      return await _handleResponse(response);
    } catch (e) {
      print('Error requesting modification: $e');
    }
    return null;
  }

  Future<Booking?> confirmModification(String id) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.createBooking}/$id/modification/confirm'),
        headers: await _getHeaders(),
      );
      final data = await _handleResponse(response);
      if (data != null) {
        return Booking.fromJson(data);
      }
    } catch (e) {
      print('Error confirming modification: $e');
    }
    return null;
  }

  Future<dynamic> submitReview(String id, Map<String, dynamic> reviewData) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.createBooking}/$id/review'),
        headers: await _getHeaders(),
        body: json.encode(reviewData),
      );
      return await _handleResponse(response);
    } catch (e) {
      print('Error submitting review: $e');
    }
    return null;
  }

  Future<Booking?> markBookingPaymentComplete(String id, String paymentIntentId) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.createBooking}/$id/payment-complete'),
        headers: await _getHeaders(),
        body: json.encode({'paymentIntentId': paymentIntentId}),
      );
      final data = await _handleResponse(response);
      if (data != null) {
        return Booking.fromJson(data);
      }
    } catch (e) {
      print('Error marking payment complete: $e');
    }
    return null;
  }

  // Public Assets & Settings
  Future<Map<String, String>> fetchStripeConfig() async {
    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/api/public/stripe/config'),
        headers: await _getHeaders(),
      );
      final data = await _handleResponse(response);
      if (data != null) {
        return {'publishableKey': data['publishableKey']?.toString() ?? ''};
      }
    } catch (e) {
      print('Error fetching stripe config: $e');
    }
    return {'publishableKey': ''};
  }

  Future<List<dynamic>> fetchHomepageLogos() async {
    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/api/public/homepage-logos'),
        headers: await _getHeaders(),
      );
      return await _handleResponse(response) ?? [];
    } catch (e) {
      print('Error fetching homepage logos: $e');
    }
    return [];
  }

  Future<Map<String, dynamic>> fetchSiteSettings() async {
    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/api/public/settings'),
        headers: await _getHeaders(),
      );
      return await _handleResponse(response) ?? {
        'searchingScreenDuration': 5000,
        'heroImageUrl': "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2070"
      };
    } catch (e) {
      print('Error fetching site settings: $e');
    }
    return {
      'searchingScreenDuration': 5000,
      'heroImageUrl': "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2070"
    };
  }

  Future<Map<String, dynamic>> fetchHomepageContent() async {
    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/api/homepage/content'),
        headers: await _getHeaders(),
      );
      return await _handleResponse(response) ?? {};
    } catch (e) {
      print('Error fetching homepage content: $e');
    }
    return {};
  }

  Future<List<dynamic>> fetchHomepageCategoryImages() async {
    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/api/homepage/category-images'),
        headers: await _getHeaders(),
      );
      return await _handleResponse(response) ?? [];
    } catch (e) {
      print('Error fetching category images: $e');
    }
    return [];
  }

  Future<List<dynamic>> fetchSearchingLogos(String? locationCode) async {
    try {
      String url = '${ApiConfig.baseUrl}/api/public/searching-logos';
      if (locationCode != null) url += '?locationCode=${Uri.encodeComponent(locationCode)}';
      
      final response = await http.get(Uri.parse(url), headers: await _getHeaders());
      return await _handleResponse(response) ?? [];
    } catch (e) {
      print('Error fetching searching logos: $e');
    }
    return [];
  }

  Future<dynamic> submitPartnerApplication(Map<String, dynamic> data) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/api/partner-applications/submit'),
        headers: await _getHeaders(),
        body: json.encode(data),
      );
      return await _handleResponse(response);
    } catch (e) {
      print('Error submitting partner application: $e');
    }
    return null;
  }

  // Legacy Bookings support
  Future<List<Booking>> getBookings() async {
    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.myBookings}'),
        headers: await _getHeaders(),
      );
      final data = await _handleResponse(response);
      if (data != null && data is List) {
        return data.map((json) => Booking.fromJson(json)).toList();
      }
    } catch (e) {
      print('Error fetching bookings: $e');
    }
    return [];
  }

  // Supplier Confirmation
  Future<dynamic> getSupplierConfirmationBooking(String token) async {
    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/api/supplier/confirmation/booking?token=${Uri.encodeComponent(token)}'),
        headers: await _getHeaders(),
      );
      return await _handleResponse(response);
    } catch (e) {
      print('Error getting supplier booking: $e');
    }
    return null;
  }

  Future<bool> confirmSupplierBooking(String token, String confirmationNumber) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/api/supplier/confirmation/confirm?token=${Uri.encodeComponent(token)}&confirmationNumber=${Uri.encodeComponent(confirmationNumber)}'),
        headers: await _getHeaders(),
      );
      return response.statusCode == 200;
    } catch (e) {
      print('Error confirming supplier booking: $e');
    }
    return false;
  }

  Future<bool> rejectSupplierBooking(String token, String reason) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/api/supplier/confirmation/reject?token=${Uri.encodeComponent(token)}&reason=${Uri.encodeComponent(reason)}'),
        headers: await _getHeaders(),
      );
      return response.statusCode == 200;
    } catch (e) {
      print('Error rejecting supplier booking: $e');
    }
    return false;
  }

  // Insurance & Extras
  Future<List<dynamic>> getInsuranceOptions() async {
    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.insurance}'),
        headers: await _getHeaders(),
      );
      return await _handleResponse(response) ?? [];
    } catch (e) {
      print('Error fetching insurance: $e');
    }
    return [];
  }

  Future<List<dynamic>> getExtras() async {
    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.extras}'),
        headers: await _getHeaders(),
      );
      return await _handleResponse(response) ?? [];
    } catch (e) {
      print('Error fetching extras: $e');
    }
    return [];
  }

  // Health
  Future<bool> checkHealth() async {
    try {
      final response = await http.get(Uri.parse('${ApiConfig.baseUrl}/healthz'));
      return response.statusCode == 200;
    } catch (_) {
      return false;
    }
  }
}
