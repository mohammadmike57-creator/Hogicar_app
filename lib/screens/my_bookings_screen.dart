import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../widgets/hogi_car_logo.dart';

class MyBookingsScreen extends StatefulWidget {
  const MyBookingsScreen({super.key});

  @override
  State<MyBookingsScreen> createState() => _MyBookingsScreenState();
}

class _MyBookingsScreenState extends State<MyBookingsScreen> {
  String _activeTab = "upcoming";

  final List<Map<String, dynamic>> _upcoming = [
    {
      "id": "CR918472",
      "car": "Mercedes C-Class",
      "supplier": "Sixt",
      "supplierInit": "Sx",
      "supplierColor": const Color(0xFFFF9800),
      "pickup": "Dubai International",
      "pickupDate": "22 Aug 2026",
      "dropoff": "29 Aug 2026",
      "days": 7,
      "total": 574,
      "status": "upcoming",
    },
  ];

  final List<Map<String, dynamic>> _past = [
    {
      "id": "CR847291",
      "car": "Toyota Yaris",
      "supplier": "Hertz",
      "supplierInit": "Hz",
      "supplierColor": const Color(0xFFFFD700),
      "pickup": "London Heathrow",
      "pickupDate": "12 Jul 2025",
      "dropoff": "19 Jul 2025",
      "days": 7,
      "total": 252,
      "status": "completed",
    },
  ];

  @override
  Widget build(BuildContext context) {
    final topPadding = MediaQuery.of(context).padding.top;
    final list = _activeTab == "upcoming" ? _upcoming : _past;

    return Scaffold(
      backgroundColor: const Color(0xFFF0F4FF),
      body: Column(
        children: [
          _buildHeader(topPadding),
          Expanded(
            child: list.isEmpty 
              ? _buildEmptyState() 
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: list.length,
                  itemBuilder: (context, index) => _buildBookingCard(list[index]),
                ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader(double topPadding) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.fromLTRB(20, topPadding + 16, 20, 20),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF060E1C), Color(0xFF0C1E3A), Color(0xFF123C69)],
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const HogiCarLogo(height: 20, isWhite: true),
          const SizedBox(height: 12),
          Text("My Bookings", style: GoogleFonts.inter(fontSize: 24, fontWeight: FontWeight.w700, color: Colors.white)),
          const SizedBox(height: 4),
          Text("${_upcoming.length} upcoming · ${_past.length} completed", style: GoogleFonts.inter(fontSize: 13, color: Colors.white.withOpacity(0.7))),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(color: Colors.black.withOpacity(0.2), borderRadius: BorderRadius.circular(14)),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                _buildTabBtn("upcoming", "Upcoming"),
                _buildTabBtn("past", "Past Bookings"),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTabBtn(String key, String label) {
    final active = _activeTab == key;
    return GestureDetector(
      onTap: () => setState(() => _activeTab = key),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: active ? Colors.white : Colors.transparent,
          borderRadius: BorderRadius.circular(10),
        ),
        child: Text(
          label,
          style: GoogleFonts.inter(
            fontSize: 13,
            fontWeight: active ? FontWeight.w700 : FontWeight.w500,
            color: active ? const Color(0xFF123C69) : Colors.white.withOpacity(0.7),
          ),
        ),
      ),
    );
  }

  Widget _buildBookingCard(Map<String, dynamic> b) {
    final status = b['status'];
    final color = status == 'completed' ? const Color(0xFF15803D) : (status == 'cancelled' ? const Color(0xFFB91C1C) : const Color(0xFF1565C0));
    final bgColor = status == 'completed' ? const Color(0xFFF0FDF4) : (status == 'cancelled' ? const Color(0xFFFEF2F2) : const Color(0xFFEEF4FF));

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: const Color(0xFF1565C0).withOpacity(0.08), blurRadius: 16, offset: const Offset(0, 4))],
      ),
      child: Column(
        children: [
          Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(color: (b['supplierColor'] as Color).withOpacity(0.15), borderRadius: BorderRadius.circular(12)),
                child: Center(child: Text(b['supplierInit'], style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w700, color: b['supplierColor']))),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(b['car'], style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w700, color: const Color(0xFF1A1A2E))),
                    Text(b['supplier'], style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF6B7280))),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(color: bgColor, borderRadius: BorderRadius.circular(8)),
                child: Text(status.toUpperCase(), style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w700, color: color)),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(color: const Color(0xFFF9FAFB), borderRadius: BorderRadius.circular(14)),
            child: Column(
              children: [
                _buildDetailRow(Icons.location_on_outlined, b['pickup']),
                const Divider(height: 16),
                _buildDetailRow(Icons.calendar_today_outlined, "${b['pickupDate']} → ${b['dropoff']}"),
                const Divider(height: 16),
                _buildDetailRow(Icons.access_time, "${b['days']} days"),
              ],
            ),
          ),
          const SizedBox(height: 14),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("REF #${b['id']}", style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w500, color: const Color(0xFF9CA3AF), letterSpacing: 0.5)),
                  Text("\$${b['total']} total", style: GoogleFonts.inter(fontSize: 17, fontWeight: FontWeight.w700, color: const Color(0xFF1A1A2E))),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(color: const Color(0xFFEEF4FF), borderRadius: BorderRadius.circular(10)),
                child: Row(
                  children: [
                    Icon(status == 'upcoming' ? Icons.visibility_outlined : Icons.refresh, size: 13, color: const Color(0xFF123C69)),
                    const SizedBox(width: 5),
                    Text(status == 'upcoming' ? "View Details" : "Rebook", style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, color: const Color(0xFF123C69))),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildDetailRow(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, size: 12, color: const Color(0xFF9CA3AF)),
        const SizedBox(width: 8),
        Expanded(child: Text(text, style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF4B5563)), maxLines: 1, overflow: TextOverflow.ellipsis)),
      ],
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(24)),
              child: const Icon(Icons.bookmark_border, size: 36, color: Color(0xFFCBD5E1)),
            ),
            const SizedBox(height: 12),
            Text("No upcoming trips", style: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.w700, color: const Color(0xFF1A1A2E))),
            const SizedBox(height: 8),
            Text("Ready for your next adventure? Start searching for the perfect car.", textAlign: TextAlign.center, style: GoogleFonts.inter(fontSize: 14, color: const Color(0xFF6B7280), height: 1.5)),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () => context.read<AppProvider>().setTabIndex(0),
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF123C69), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)), padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12)),
              child: const Text("Search Cars"),
            ),
          ],
        ),
      ),
    );
  }
}
