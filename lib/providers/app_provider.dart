import 'package:flutter/material.dart';
import '../models/car.dart';
import '../models/booking.dart';
import '../models/user_profile.dart';
import '../services/api_service.dart';
import '../services/auth_service.dart';

class AppProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  final AuthService _authService = AuthService();
  UserProfile? _user;
  List<Booking> _bookings = [];
  List<Car> _cars = [];
  List<dynamic> _insuranceOptions = [];
  List<dynamic> _extras = [];
  bool _isLoading = false;
  bool _isInitialized = false;

  bool get isInitialized => _isInitialized;
  List<dynamic> get insuranceOptions => _insuranceOptions;
  List<dynamic> get extras => _extras;

  Future<void> initialize() async {
    if (_isInitialized) return;
    _isLoading = true;
    notifyListeners();

    try {
      if (await _authService.isLoggedIn()) {
        _user = await _authService.getCurrentUser();
        if (_user != null) {
          await fetchBookings();
        }
      }
      await fetchInsuranceOptions();
      await fetchExtras();
    } catch (e) {
      print('Initialization error: $e');
    }

    _isInitialized = true;
    _isLoading = false;
    notifyListeners();
  }

  Future<void> fetchInsuranceOptions() async {
    _insuranceOptions = await _apiService.getInsuranceOptions();
    if (_insuranceOptions.isEmpty) {
      // Fallback to dummy insurance
      _insuranceOptions = [
        {'id': 'basic', 'title': 'Basic Protection', 'price': 0.0, 'features': ['Collision Damage Waiver', 'Theft Protection', 'Third Party Liability']},
        {'id': 'full', 'title': 'Full Coverage', 'price': 25.0, 'features': ['Zero deductible', 'Windows, mirrors & tires', 'Roadside assistance', 'Lost keys'], 'recommended': true},
        {'id': 'premium', 'title': 'Premium Coverage', 'price': 40.0, 'features': ['All in Full Coverage', 'Personal accident insurance', 'Personal belongings', 'Premium 24/7 support']},
      ];
    }
    notifyListeners();
  }

  Future<void> fetchExtras() async {
    _extras = await _apiService.getExtras();
    if (_extras.isEmpty) {
      _extras = [
        {'id': 'gps', 'title': 'GPS Navigation', 'price': 15.0},
        {'id': 'driver', 'title': 'Additional Driver', 'price': 10.0},
        {'id': 'child_seat', 'title': 'Child Seat', 'price': 12.0},
        {'id': 'booster_seat', 'title': 'Booster Seat', 'price': 8.0},
        {'id': 'snow_chains', 'title': 'Snow Chains', 'price': 20.0},
      ];
    }
    notifyListeners();
  }

  // Auth Methods
  Future<bool> login(String email, String password) async {
    _isLoading = true;
    notifyListeners();

    try {
      final user = await _authService.login(email, password);
      if (user != null) {
        _user = user;
        await fetchBookings();
        _isLoading = false;
        notifyListeners();
        return true;
      }
    } catch (e) {
      print('Login error: $e');
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  Future<bool> register(Map<String, dynamic> userData) async {
    _isLoading = true;
    notifyListeners();

    try {
      final user = await _authService.register(userData);
      if (user != null) {
        _user = user;
        _isLoading = false;
        notifyListeners();
        return true;
      }
    } catch (e) {
      print('Register error: $e');
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  Future<void> logout() async {
    await _authService.logout();
    _user = null;
    _bookings = [];
    notifyListeners();
  }
  
  // Search Criteria
  String _pickupLocation = '';
  String _dropoffLocation = '';
  String _pickupCode = '';
  String _dropoffCode = '';
  DateTime? _pickupDate;
  DateTime? _returnDate;
  String _pickupTime = '10:00';
  String _dropoffTime = '10:00';
  
  // Booking in progress
  double _extraInsurancePrice = 0.0;
  Map<String, bool> _selectedExtras = {};
  String _firstName = '';
  String _lastName = '';
  String _email = '';
  String _phone = '';
  String _nationality = '';
  String _flightNumber = '';
  String _licenseNumber = '';
  String _licenseExpiry = '';
  String _dateOfBirth = '';
  String _address = '';
  String _passportNumber = '';

  void setInsurance(double price) {
    _extraInsurancePrice = price;
    notifyListeners();
  }

  void setExtras(Map<String, bool> extras) {
    _selectedExtras = extras;
    notifyListeners();
  }

  void setDriverInfo({
    required String firstName,
    required String lastName,
    required String email,
    required String phone,
    String nationality = '',
    String flightNumber = '',
    String licenseNumber = '',
    String licenseExpiry = '',
    String dateOfBirth = '',
    String address = '',
    String passportNumber = '',
  }) {
    _firstName = firstName;
    _lastName = lastName;
    _email = email;
    _phone = phone;
    _nationality = nationality;
    _flightNumber = flightNumber;
    _licenseNumber = licenseNumber;
    _licenseExpiry = licenseExpiry;
    _dateOfBirth = dateOfBirth;
    _address = address;
    _passportNumber = passportNumber;
    notifyListeners();
  }

  double get extraInsurancePrice => _extraInsurancePrice;
  Map<String, bool> get selectedExtras => _selectedExtras;
  String get firstName => _firstName;
  String get lastName => _lastName;
  String get email => _email;
  String get phone => _phone;
  String get nationality => _nationality;
  String get flightNumber => _flightNumber;
  String get licenseNumber => _licenseNumber;
  String get licenseExpiry => _licenseExpiry;
  String get dateOfBirth => _dateOfBirth;
  String get address => _address;
  String get passportNumber => _passportNumber;
  bool _filterSuv = false;
  bool _filterDisinfected = false;
  bool _filterInTerminal = false;
  bool _filterFreeCancellation = false;
  List<String> _selectedSuppliers = [];
  int _currentTabIndex = 0;

  UserProfile? get user => _user;
  List<Booking> get bookings => _bookings;
  List<Car> get cars => _cars;
  bool get isLoading => _isLoading;
  int get currentTabIndex => _currentTabIndex;

  void setTabIndex(int index) {
    _currentTabIndex = index;
    notifyListeners();
  }
  
  String get pickupLocation => _pickupLocation;
  String get dropoffLocation => _dropoffLocation;
  String get pickupCode => _pickupCode;
  String get dropoffCode => _dropoffCode;
  DateTime? get pickupDate => _pickupDate;
  DateTime? get returnDate => _returnDate;
  String get pickupTime => _pickupTime;
  String get dropoffTime => _dropoffTime;
  
  bool get filterSuv => _filterSuv;
  bool get filterDisinfected => _filterDisinfected;
  bool get filterInTerminal => _filterInTerminal;
  bool get filterFreeCancellation => _filterFreeCancellation;
  List<String> get selectedSuppliers => _selectedSuppliers;

  List<String> get availableSuppliers {
    return _cars.map((c) => c.rentalCompany).toSet().toList()..sort();
  }

  void toggleSupplierFilter(String supplier) {
    if (_selectedSuppliers.contains(supplier)) {
      _selectedSuppliers.remove(supplier);
    } else {
      _selectedSuppliers.add(supplier);
    }
    notifyListeners();
  }

  void clearSupplierFilters() {
    _selectedSuppliers = [];
    notifyListeners();
  }

  List<Car> get featuredCars {
    return _cars.take(5).toList();
  }

  Future<void> loadProfile() async {
    _user = await _apiService.getProfile();
    notifyListeners();
  }

  void setSearchCriteria({
    required String pickup,
    required String pickupCode,
    required String dropoff,
    required String dropoffCode,
    required DateTime pickupDate,
    required DateTime returnDate,
    String pickupTime = '10:00',
    String dropoffTime = '10:00',
  }) {
    _pickupLocation = pickup;
    _pickupCode = pickupCode;
    _dropoffLocation = dropoff;
    _dropoffCode = dropoffCode;
    _pickupDate = pickupDate;
    _returnDate = returnDate;
    _pickupTime = pickupTime;
    _dropoffTime = dropoffTime;
    notifyListeners();
    searchCars();
  }

  Future<void> searchCars() async {
    if (_pickupCode.isEmpty || _pickupDate == null || _returnDate == null) return;
    
    _isLoading = true;
    notifyListeners();
    
    // Format dates to YYYY-MM-DD as expected by the backend
    String pickupDateStr = _pickupDate!.toIso8601String().split('T')[0];
    String returnDateStr = _returnDate!.toIso8601String().split('T')[0];

    try {
      _cars = await _apiService.searchCars(
        pickup: _pickupCode,
        dropoff: _dropoffCode.isNotEmpty ? _dropoffCode : _pickupCode,
        pickupDate: pickupDateStr,
        dropoffDate: returnDateStr,
        startTime: _pickupTime,
        endTime: _dropoffTime,
      );
    } catch (e) {
      debugPrint('Error searching cars: $e');
      _cars = [];
    }
    
    _isLoading = false;
    notifyListeners();
  }

  void toggleFilterSuv() {
    _filterSuv = !_filterSuv;
    notifyListeners();
  }

  void toggleFilterDisinfected() {
    _filterDisinfected = !_filterDisinfected;
    notifyListeners();
  }

  void toggleFilterInTerminal() {
    _filterInTerminal = !_filterInTerminal;
    notifyListeners();
  }

  void toggleFilterFreeCancellation() {
    _filterFreeCancellation = !_filterFreeCancellation;
    notifyListeners();
  }

  List<Car> get filteredCars {
    return _cars.where((car) {
      if (_filterSuv && !car.isSuv) return false;
      if (_filterDisinfected && !car.isDisinfected) return false;
      if (_filterInTerminal && !car.isInTerminal) return false;
      if (_filterFreeCancellation && !car.freeCancellation) return false;
      return true;
    }).toList();
  }

  Future<void> fetchBookings() async {
    _isLoading = true;
    notifyListeners();
    
    _bookings = await _apiService.getBookings();
    
    _isLoading = false;
    notifyListeners();
  }

  Future<void> addBooking(Map<String, dynamic> bookingData) async {
    final booking = await _apiService.createBooking(bookingData);
    if (booking != null) {
      _bookings.insert(0, booking);
      notifyListeners();
    }
  }

  Future<Booking?> lookupBookingByRef(String ref) async {
    _isLoading = true;
    notifyListeners();
    try {
      final booking = await _apiService.getBookingByRef(ref);
      _isLoading = false;
      notifyListeners();
      return booking;
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      return null;
    }
  }

  Future<void> cancelBooking(String bookingId) async {
    final canceledBooking = await _apiService.cancelBooking(bookingId);
    if (canceledBooking != null) {
      final index = _bookings.indexWhere((b) => b.id == bookingId);
      if (index != -1) {
        _bookings[index] = canceledBooking;
        notifyListeners();
      }
    }
  }
}
