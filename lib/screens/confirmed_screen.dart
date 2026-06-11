import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../models/car.dart';
import '../providers/app_provider.dart';

class ConfirmedScreen extends StatefulWidget {
  final String bookingRef;
  final Car car;

  const ConfirmedScreen({
    super.key,
    required this.bookingRef,
    required this.car,
  });

  @override
  State<ConfirmedScreen> createState() => _ConfirmedScreenState();
}

class _ConfirmedScreenState extends State<ConfirmedScreen> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(milliseconds: 800));
    _scaleAnimation = CurvedAnimation(parent: _controller, curve: Curves.elasticOut);
    _fadeAnimation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _controller, curve: const Interval(0.4, 1.0, curve: Curves.easeIn)),
    );
    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  String _formatDate(DateTime d) {
    return DateFormat('d MMM, yyyy').format(d);
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AppProvider>();
    final topPadding = MediaQuery.of(context).padding.top;
    final bottomPadding = MediaQuery.of(context).padding.bottom;
    
    final days = provider.returnDate?.difference(provider.pickupDate ?? DateTime.now()).inDays.clamp(1, 999) ?? 1;
    final insuranceTotal = provider.extraInsurancePrice * days;
    final baseTotal = widget.car.pricePerDay * days;
    final taxes = (baseTotal * 0.12).round();
    final grandTotal = (baseTotal + insuranceTotal + taxes).round();

    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FB),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Column(
          children: [
            SizedBox(height: topPadding + 40),
            // Success Section
            ScaleTransition(
              scale: _scaleAnimation,
              child: Container(
                width: 80,
                height: 80,
                decoration: const BoxDecoration(
                  color: Color(0xFF15803D),
                  shape: BoxShape.circle,
                  boxShadow: [BoxShadow(color: Color(0xFF15803D), blurRadius: 12, offset: Offset(0, 6))],
                ),
                child: const Icon(Icons.check, size: 40, color: Colors.white),
              ),
            ),
            const SizedBox(height: 24),
            FadeTransition(
              opacity: _fadeAnimation,
              child: Column(
                children: [
                  Text("Booking Confirmed!", style: GoogleFonts.inter(fontSize: 26, fontWeight: FontWeight.w700, color: const Color(0xFF1A1A2E))),
                  const SizedBox(height: 4),
                  Text("Your car has been reserved successfully", style: GoogleFonts.inter(fontSize: 15, color: const Color(0xFF6B7280))),
                  const SizedBox(height: 24),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                    decoration: BoxDecoration(color: const Color(0xFFEEF4FF), borderRadius: BorderRadius.circular(14)),
                    child: Column(
                      children: [
                        Text("Booking Reference", style: GoogleFonts.inter(fontSize: 11, color: const Color(0xFF123C69), letterSpacing: 0.5)),
                        const SizedBox(height: 2),
                        Text(widget.bookingRef, style: GoogleFonts.inter(fontSize: 22, fontWeight: FontWeight.w700, color: const Color(0xFF123C69), letterSpacing: 2)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            // Details Card
            _buildDetailCard(provider, days, insuranceTotal > 0),
            // Price Card
            _buildPriceCard(baseTotal.round(), insuranceTotal.round(), taxes, grandTotal),
            const SizedBox(height: 24),
            // Actions
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () => Navigator.of(context).popUntil((route) => route.isFirst),
                      icon: const Icon(Icons.home_outlined, size: 18),
                      label: const Text("Back to Home"),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: const Color(0xFF123C69),
                        side: const BorderSide(color: Color(0xFF123C69), width: 1.5),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () => Navigator.of(context).popUntil((route) => route.isFirst),
                      icon: const Icon(Icons.search, size: 18),
                      label: const Text("New Search"),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF123C69),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(height: bottomPadding + 40),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailCard(AppProvider provider, int days, bool hasInsurance) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)]),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text("Booking Details", style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: const Color(0xFF1A1A2E))),
          const SizedBox(height: 12),
          _buildDetailRow(Icons.person_outline, "Driver", "John Smith"),
          _buildDetailRow(Icons.directions_car_outlined, "Vehicle", "${widget.car.name} or similar"),
          _buildDetailRow(Icons.business_outlined, "Supplier", widget.car.rentalCompany),
          _buildDetailRow(Icons.location_on_outlined, "Pickup", provider.pickupLocation),
          _buildDetailRow(Icons.calendar_today_outlined, "Pickup Date", "${_formatDate(provider.pickupDate!)} at ${provider.pickupTime}"),
          _buildDetailRow(Icons.calendar_today_outlined, "Return Date", "${_formatDate(provider.returnDate!)} at ${provider.dropoffTime}"),
          _buildDetailRow(Icons.access_time, "Duration", "$days ${days == 1 ? "day" : "days"}"),
          if (hasInsurance) _buildDetailRow(Icons.shield_outlined, "Coverage", "Full Coverage Insurance"),
        ],
      ),
    );
  }

  Widget _buildDetailRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 16, color: const Color(0xFF123C69)),
          const SizedBox(width: 10),
          Text(label, style: GoogleFonts.inter(fontSize: 13, color: const Color(0xFF6B7280))),
          const Spacer(),
          Expanded(flex: 2, child: Text(value, textAlign: TextAlign.right, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w500, color: const Color(0xFF1A1A2E)))),
        ],
      ),
    );
  }

  Widget _buildPriceCard(int base, int insurance, int taxes, int total) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)]),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text("Price Summary", style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: const Color(0xFF1A1A2E))),
          const SizedBox(height: 12),
          _buildSummaryRow("Base Rental", "\$$base"),
          if (insurance > 0) _buildSummaryRow("Full Coverage", "\$$insurance"),
          _buildSummaryRow("Taxes & Fees", "\$$taxes"),
          const Divider(height: 24, color: Color(0xFFE5E7EB)),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text("Total Charged", style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w600, color: const Color(0xFF1A1A2E))),
              Text("\$$total", style: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.w700, color: const Color(0xFF1A1A2E))),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: GoogleFonts.inter(fontSize: 13, color: const Color(0xFF6B7280))),
          Text(value, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w500, color: const Color(0xFF1A1A2E))),
        ],
      ),
    );
  }
}
