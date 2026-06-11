import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../models/car.dart';
import '../theme/app_theme.dart';
import 'hogi_car_logo.dart';

class VehicleCard extends StatelessWidget {
  final Car car;
  final VoidCallback onPress;
  final int rentalDays;

  const VehicleCard({
    super.key,
    required this.car,
    required this.onPress,
    required this.rentalDays,
  });

  String _getRatingLabel(double r) {
    if (r >= 9) return "Exceptional";
    if (r >= 8.5) return "Superb";
    if (r >= 8) return "Excellent";
    if (r >= 7.5) return "Very Good";
    return "Good";
  }

  String _getSupplierInitials(String name) {
    if (name.isEmpty) return "HC";
    List<String> parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, (name.length >= 2 ? 2 : name.length)).toUpperCase();
  }

  Color _getSupplierColor(String name) {
    final lower = name.toLowerCase();
    if (lower.contains('hertz')) return const Color(0xFFFFD100);
    if (lower.contains('avis')) return const Color(0xFFD40000);
    if (lower.contains('sixt')) return const Color(0xFFFF5F00);
    if (lower.contains('europcar')) return const Color(0xFF008000);
    if (lower.contains('budget')) return const Color(0xFF003399);
    return const Color(0xFF1565C0);
  }

  @override
  Widget build(BuildContext context) {
    final supplierColor = _getSupplierColor(car.rentalCompany);
    final dailyRate = car.pricePerDay.round();
    final totalPrice = (car.pricePerDay * rentalDays).round();

    return GestureDetector(
      onTap: onPress,
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          children: [
            // Image Section
            Stack(
              children: [
                Container(
                  height: 160,
                  width: double.infinity,
                  color: const Color(0xFFF9FAFB),
                  child: car.imageUrl.startsWith('http')
                      ? CachedNetworkImage(
                          imageUrl: car.imageUrl,
                          fit: BoxFit.contain,
                          placeholder: (context, url) => const Center(child: CircularProgressIndicator()),
                          errorWidget: (context, url, error) => Image.asset('assets/images/car-sedan.png', fit: BoxFit.contain),
                        )
                      : Image.asset(
                          car.imageUrl.isNotEmpty ? car.imageUrl : 'assets/images/car-sedan.png',
                          fit: BoxFit.contain,
                        ),
                ),
                Positioned(
                  top: 10,
                  left: 10,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: const Color(0xFF123C69).withOpacity(0.9),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      car.type.toUpperCase(),
                      style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w600, color: Colors.white),
                    ),
                  ),
                ),
              ],
            ),
            // Body Section
            Padding(
              padding: const EdgeInsets.all(14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header Row
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              car.name,
                              style: GoogleFonts.inter(fontSize: 17, fontWeight: FontWeight.w600, color: const Color(0xFF1A1A2E)),
                            ),
                            Text(
                              "or similar",
                              style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF6B7280)),
                            ),
                          ],
                        ),
                      ),
                      if (car.isHogicarChoiceBranded || car.rentalCompanyLogo == 'HOGICAR_CHOICE_LOGO' || car.rentalCompany == 'Hogi Car Choice')
                        const HogiCarLogo(height: 32, showText: true)
                      else if (car.rentalCompanyLogo.isNotEmpty)
                        Container(
                          width: 48,
                          height: 36,
                          padding: const EdgeInsets.all(4),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: const Color(0xFFE5E7EB)),
                          ),
                          child: car.rentalCompanyLogo.startsWith('http')
                              ? CachedNetworkImage(
                                  imageUrl: car.rentalCompanyLogo,
                                  fit: BoxFit.contain,
                                  errorWidget: (context, url, error) => Center(
                                    child: Text(
                                      _getSupplierInitials(car.rentalCompany),
                                      style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700, color: supplierColor),
                                    ),
                                  ),
                                )
                              : Image.asset(car.rentalCompanyLogo, fit: BoxFit.contain),
                        )
                      else
                        Container(
                          width: 36,
                          height: 36,
                          decoration: BoxDecoration(
                            color: supplierColor.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Center(
                            child: Text(
                              _getSupplierInitials(car.rentalCompany),
                              style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700, color: supplierColor),
                            ),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  // Rating Row
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: const Color(0xFF123C69),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          car.rating.toStringAsFixed(1),
                          style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700, color: Colors.white),
                        ),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        _getRatingLabel(car.rating),
                        style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w500, color: const Color(0xFF1A1A2E)),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        "(${car.reviewsCount} reviews)",
                        style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF6B7280)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  // Specs Row
                  Row(
                    children: [
                      _buildSpec(Icons.people_outline, "${car.seats} seats"),
                      const SizedBox(width: 14),
                      _buildSpec(Icons.work_outline, "${car.bags} bags"),
                      const SizedBox(width: 14),
                      _buildSpec(Icons.settings_outlined, car.transmission),
                    ],
                  ),
                  const SizedBox(height: 14),
                  const Divider(color: Color(0xFFE5E7EB), height: 1),
                  const SizedBox(height: 12),
                  // Footer Row
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "\$$totalPrice",
                            style: GoogleFonts.inter(fontSize: 22, fontWeight: FontWeight.w700, color: const Color(0xFF1A1A2E)),
                          ),
                          Text(
                            "\$$dailyRate/day · $rentalDays days",
                            style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF6B7280)),
                          ),
                        ],
                      ),
                      GestureDetector(
                        onTap: onPress,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 11),
                          decoration: BoxDecoration(
                            color: const Color(0xFF123C69),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text(
                            "View Deal",
                            style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: Colors.white),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSpec(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, size: 14, color: const Color(0xFF6B7280)),
        const SizedBox(width: 4),
        Text(
          text,
          style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF6B7280)),
        ),
      ],
    );
  }
}
