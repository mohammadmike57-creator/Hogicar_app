class Car {
  final String id;
  final String name;
  final String brand;
  final String model;
  final String imageUrl;
  final double pricePerDay;
  final double rating;
  final int reviewsCount;
  final int seats;
  final String transmission; // Manual, Automatic
  final String fuelType; // Petrol, Diesel, Electric
  final String type; // SUV, Sedan, Standard, etc.
  final int bags;
  final bool isSuv;
  final bool isDisinfected;
  final bool isInTerminal;
  final bool freeCancellation;
  final bool instantConfirmation;
  final String rentalCompany;
  final String rentalCompanyLogo;
  final String? supplierId;
  final String currency;
  final String fuelPolicy;
  final String mileagePolicy;
  final List<String> coverage;
  final bool isHogicarChoice;
  final bool isHogicarChoiceBranded;

  Car({
    required this.id,
    required this.name,
    required this.brand,
    required this.model,
    required this.imageUrl,
    required this.pricePerDay,
    required this.rating,
    required this.reviewsCount,
    required this.seats,
    required this.transmission,
    required this.fuelType,
    this.type = 'Standard',
    this.bags = 2,
    this.isSuv = false,
    this.isDisinfected = true,
    this.isInTerminal = true,
    this.freeCancellation = true,
    this.instantConfirmation = true,
    required this.rentalCompany,
    required this.rentalCompanyLogo,
    this.supplierId,
    this.currency = 'USD',
    required this.fuelPolicy,
    required this.mileagePolicy,
    required this.coverage,
    this.isHogicarChoice = false,
    this.isHogicarChoiceBranded = false,
  });

  factory Car.fromJson(Map<String, dynamic> json) {
    return Car(
      id: json['id']?.toString() ?? '',
      name: '${json['brand'] ?? json['make'] ?? ''} ${json['model'] ?? ''}'.trim(),
      brand: json['brand'] ?? json['make'] ?? '',
      model: json['model'] ?? '',
      imageUrl: json['imageUrl'] ?? '',
      pricePerDay: (json['price'] ?? json['dailyRate'] ?? 0.0).toDouble(),
      rating: (json['rating'] ?? 4.5).toDouble(),
      reviewsCount: json['reviewsCount'] ?? 10,
      seats: json['seats'] ?? json['passengers'] ?? 5,
      transmission: json['transmission'] ?? 'Automatic',
      fuelType: json['fuelType'] ?? 'Petrol',
      type: json['category'] ?? json['type'] ?? 'Standard',
      bags: json['bags'] ?? 2,
      isSuv: json['isSuv'] ?? (json['category'] == 'SUV'),
      isDisinfected: json['isDisinfected'] ?? true,
      isInTerminal: json['isInTerminal'] ?? true,
      freeCancellation: json['freeCancellation'] ?? true,
      instantConfirmation: json['instantConfirmation'] ?? true,
      rentalCompany: json['supplierName'] ?? json['rentalCompany'] ?? 'Hogi Car',
      rentalCompanyLogo: json['supplierLogoUrl'] ?? json['rentalCompanyLogo'] ?? '',
      supplierId: json['supplierId']?.toString(),
      currency: json['currency'] ?? 'USD',
      fuelPolicy: json['fuelPolicy'] ?? 'Full to Full',
      mileagePolicy: json['mileagePolicy'] ?? 'Unlimited',
      coverage: json['coverage'] != null 
          ? List<String>.from(json['coverage']) 
          : ['Collision Damage Waiver', 'Theft Protection', 'Third Party Liability'],
      isHogicarChoice: json['hogicarChoice'] ?? false,
      isHogicarChoiceBranded: json['isHogicarChoiceBranded'] ?? false,
    );
  }

  Car copyWith({
    String? id,
    String? name,
    String? brand,
    String? model,
    String? imageUrl,
    double? pricePerDay,
    double? rating,
    int? reviewsCount,
    int? seats,
    String? transmission,
    String? fuelType,
    String? type,
    int? bags,
    bool? isSuv,
    bool? isDisinfected,
    bool? isInTerminal,
    bool? freeCancellation,
    bool? instantConfirmation,
    String? rentalCompany,
    String? rentalCompanyLogo,
    String? supplierId,
    String? currency,
    String? fuelPolicy,
    String? mileagePolicy,
    List<String>? coverage,
    bool? isHogicarChoice,
    bool? isHogicarChoiceBranded,
  }) {
    return Car(
      id: id ?? this.id,
      name: name ?? this.name,
      brand: brand ?? this.brand,
      model: model ?? this.model,
      imageUrl: imageUrl ?? this.imageUrl,
      pricePerDay: pricePerDay ?? this.pricePerDay,
      rating: rating ?? this.rating,
      reviewsCount: reviewsCount ?? this.reviewsCount,
      seats: seats ?? this.seats,
      transmission: transmission ?? this.transmission,
      fuelType: fuelType ?? this.fuelType,
      type: type ?? this.type,
      bags: bags ?? this.bags,
      isSuv: isSuv ?? this.isSuv,
      isDisinfected: isDisinfected ?? this.isDisinfected,
      isInTerminal: isInTerminal ?? this.isInTerminal,
      freeCancellation: freeCancellation ?? this.freeCancellation,
      instantConfirmation: instantConfirmation ?? this.instantConfirmation,
      rentalCompany: rentalCompany ?? this.rentalCompany,
      rentalCompanyLogo: rentalCompanyLogo ?? this.rentalCompanyLogo,
      supplierId: supplierId ?? this.supplierId,
      currency: currency ?? this.currency,
      fuelPolicy: fuelPolicy ?? this.fuelPolicy,
      mileagePolicy: mileagePolicy ?? this.mileagePolicy,
      coverage: coverage ?? this.coverage,
      isHogicarChoice: isHogicarChoice ?? this.isHogicarChoice,
      isHogicarChoiceBranded: isHogicarChoiceBranded ?? this.isHogicarChoiceBranded,
    );
  }
}
