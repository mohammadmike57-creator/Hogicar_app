import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../models/car.dart';
import '../providers/app_provider.dart';
import '../widgets/image_carousel.dart';
import '../widgets/insurance_widget.dart';
import '../widgets/hogi_car_logo.dart';
import 'booking_screen.dart';

class CarDetailsScreen extends StatefulWidget {
  final Car car;
  const CarDetailsScreen({super.key, required this.car});

  @override
  State<CarDetailsScreen> createState() => _CarDetailsScreenState();
}

class _CarDetailsScreenState extends State<CarDetailsScreen> {
  bool _addInsurance = false;
  final int _insurancePriceDay = 18;

  final List<String> _included = [
    "Third-Party Liability",
    "Theft Protection",
    "Collision Damage Waiver",
    "Unlimited Mileage",
    "Breakdown Assistance",
  ];

  final List<String> _extra = [
    "Full Coverage Insurance",
    "GPS Navigation",
    "Child Safety Seat",
    "Additional Driver",
  ];

  String _formatDate(DateTime d) {
    return DateFormat('d MMM, yyyy').format(d);
  }

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

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AppProvider>();
    final size = MediaQuery.of(context).size;
    final topPadding = MediaQuery.of(context).padding.top;
    final bottomPadding = MediaQuery.of(context).padding.bottom;
    
    final days = provider.returnDate?.difference(provider.pickupDate ?? DateTime.now()).inDays.clamp(1, 999) ?? 1;
    final insuranceTotal = _addInsurance ? _insurancePriceDay * days : 0;
    final totalPrice = (widget.car.pricePerDay * days).round() + insuranceTotal;

    return Scaffold(
      backgroundColor: const Color(0xFFF0F4FF),
      body: Stack(
        children: [
          SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            child: Column(
              children: [
                ImageCarousel(images: [widget.car.imageUrl]),
                _buildHeaderSection(),
                _buildPickupSection(provider),
                _buildInclusionsSection(),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Text("Add Protection", style: GoogleFonts.inter(fontSize: 17, fontWeight: FontWeight.w600, color: const Color(0xFF1A1A2E))),
                ),
                InsuranceWidget(
                  added: _addInsurance,
                  onToggle: () => setState(() => _addInsurance = !_addInsurance),
                  pricePerDay: _insurancePriceDay,
                ),
                SizedBox(height: 100 + bottomPadding),
              ],
            ),
          ),
          // Custom Back Button
          Positioned(
            top: topPadding + 10,
            left: 16,
            child: GestureDetector(
              onTap: () => Navigator.pop(context),
              child: Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(color: Colors.white, shape: BoxShape.circle, boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 4)]),
                child: const Icon(Icons.arrow_back, color: Color(0xFF1A1A2E), size: 20),
              ),
            ),
          ),
          // Bottom Bar
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              padding: EdgeInsets.fromLTRB(16, 12, 16, bottomPadding + 16),
              decoration: BoxDecoration(
                color: Colors.white,
                border: Border(top: BorderSide(color: const Color(0xFFE5E7EB))),
                boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 8, offset: const Offset(0, -4))],
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text("Total Price", style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF6B7280))),
                      Text("\$$totalPrice", style: GoogleFonts.inter(fontSize: 26, fontWeight: FontWeight.w700, color: const Color(0xFF1A1A2E))),
                      Text("$days days · all fees included", style: GoogleFonts.inter(fontSize: 11, color: const Color(0xFF6B7280))),
                    ],
                  ),
                  GestureDetector(
                    onTap: () {
                      context.read<AppProvider>().setInsurance(_addInsurance ? _insurancePriceDay.toDouble() : 0.0);
                      Navigator.push(context, MaterialPageRoute(builder: (context) => BookingScreen(car: widget.car)));
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                      decoration: BoxDecoration(
                        color: const Color(0xFF123C69),
                        borderRadius: BorderRadius.circular(14),
                        boxShadow: [BoxShadow(color: const Color(0xFF123C69).withOpacity(0.3), blurRadius: 8, offset: const Offset(0, 4))],
                      ),
                      child: Row(
                        children: [
                          Text("Book Now", style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: Colors.white)),
                          const SizedBox(width: 8),
                          const Icon(Icons.arrow_forward, color: Colors.white, size: 18),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeaderSection() {
    return Container(
      padding: const EdgeInsets.all(16),
      color: Colors.white,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(widget.car.name, style: GoogleFonts.inter(fontSize: 22, fontWeight: FontWeight.w700, color: const Color(0xFF1A1A2E))),
                    Text("or similar · ${widget.car.type}", style: GoogleFonts.inter(fontSize: 13, color: const Color(0xFF6B7280))),
                  ],
                ),
              ),
              if (widget.car.isHogicarChoiceBranded || widget.car.rentalCompanyLogo == 'HOGICAR_CHOICE_LOGO' || widget.car.rentalCompany == 'Hogi Car Choice')
                const HogiCarLogo(height: 32, showText: true)
              else if (widget.car.rentalCompanyLogo.isNotEmpty)
                Container(
                  width: 50,
                  height: 40,
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: const Color(0xFFE5E7EB)),
                  ),
                  child: widget.car.rentalCompanyLogo.startsWith('http')
                      ? CachedNetworkImage(
                          imageUrl: widget.car.rentalCompanyLogo,
                          fit: BoxFit.contain,
                          errorWidget: (context, url, error) => Center(
                            child: Text(
                              _getSupplierInitials(widget.car.rentalCompany),
                              style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: const Color(0xFF123C69)),
                            ),
                          ),
                        )
                      : Image.asset(widget.car.rentalCompanyLogo, fit: BoxFit.contain),
                )
              else
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(color: const Color(0xFF123C69).withOpacity(0.15), borderRadius: BorderRadius.circular(10)),
                  child: Center(child: Text(_getSupplierInitials(widget.car.rentalCompany), style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: const Color(0xFF123C69)))),
                ),
            ],
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                decoration: BoxDecoration(color: const Color(0xFF123C69), borderRadius: BorderRadius.circular(6)),
                child: Text(widget.car.rating.toStringAsFixed(1), style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700, color: Colors.white)),
              ),
              const SizedBox(width: 6),
              Text(_getRatingLabel(widget.car.rating), style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w500, color: const Color(0xFF1A1A2E))),
              const SizedBox(width: 6),
              Text("(${widget.car.reviewsCount} reviews)", style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF6B7280))),
            ],
          ),
          const SizedBox(height: 18),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              _buildSpecItem(Icons.people_outline, "${widget.car.seats} seats"),
              _buildSpecItem(Icons.work_outline, "${widget.car.bags} bags"),
              _buildSpecItem(Icons.settings_outlined, widget.car.transmission),
              _buildSpecItem(Icons.ac_unit, "Air con"),
              _buildSpecItem(Icons.local_gas_station_outlined, widget.car.fuelType),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSpecItem(IconData icon, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      decoration: BoxDecoration(color: const Color(0xFFF3F4F6), borderRadius: BorderRadius.circular(8)),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: const Color(0xFF6B7280)),
          const SizedBox(width: 6),
          Text(label, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w500, color: const Color(0xFF1A1A2E))),
        ],
      ),
    );
  }

  Widget _buildPickupSection(AppProvider provider) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text("Pickup Details", style: GoogleFonts.inter(fontSize: 17, fontWeight: FontWeight.w600, color: const Color(0xFF1A1A2E))),
          const SizedBox(height: 12),
          Container(
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14), border: Border.all(color: const Color(0xFFE5E7EB))),
            child: Column(
              children: [
                _buildLocationRow(Icons.location_on_outlined, "Pickup location", provider.pickupLocation),
                const Divider(height: 1, indent: 14, endIndent: 14),
                _buildLocationRow(Icons.navigation_outlined, "Counter type", "Airport Terminal"),
                const Divider(height: 1, indent: 14, endIndent: 14),
                Padding(
                  padding: const EdgeInsets.all(14),
                  child: Row(
                    children: [
                      _buildInfoItem("Pickup", "${_formatDate(provider.pickupDate!)} ${provider.pickupTime}"),
                      const SizedBox(width: 20),
                      _buildInfoItem("Return", "${_formatDate(provider.returnDate!)} ${provider.dropoffTime}"),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLocationRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.all(14),
      child: Row(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(color: const Color(0xFFEEF4FF), borderRadius: BorderRadius.circular(10)),
            child: Icon(icon, color: const Color(0xFF123C69), size: 16),
          ),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: GoogleFonts.inter(fontSize: 11, color: const Color(0xFF6B7280))),
              Text(value, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w500, color: const Color(0xFF1A1A2E))),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildInfoItem(String label, String value) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: GoogleFonts.inter(fontSize: 11, color: const Color(0xFF6B7280))),
          const SizedBox(height: 2),
          Text(value, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w500, color: const Color(0xFF1A1A2E))),
        ],
      ),
    );
  }

  Widget _buildInclusionsSection() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text("What's Included", style: GoogleFonts.inter(fontSize: 17, fontWeight: FontWeight.w600, color: const Color(0xFF1A1A2E))),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14), border: Border.all(color: const Color(0xFFE5E7EB))),
            child: Column(
              children: _included.map((item) => Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: Row(
                  children: [
                    const Icon(Icons.check_circle_outline, size: 16, color: Color(0xFF15803D)),
                    const SizedBox(width: 10),
                    Text(item, style: GoogleFonts.inter(fontSize: 14, color: const Color(0xFF1A1A2E))),
                  ],
                ),
              )).toList(),
            ),
          ),
          const SizedBox(height: 16),
          Text("What's Extra", style: GoogleFonts.inter(fontSize: 17, fontWeight: FontWeight.w600, color: const Color(0xFF1A1A2E))),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14), border: Border.all(color: const Color(0xFFE5E7EB))),
            child: Column(
              children: _extra.map((item) => Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: Row(
                  children: [
                    const Icon(Icons.add_circle_outline, size: 16, color: Color(0xFF6B7280)),
                    const SizedBox(width: 10),
                    Text(item, style: GoogleFonts.inter(fontSize: 14, color: const Color(0xFF6B7280))),
                  ],
                ),
              )).toList(),
            ),
          ),
        ],
      ),
    );
  }
}
