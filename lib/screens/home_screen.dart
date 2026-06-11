import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../providers/app_provider.dart';
import '../widgets/hogi_car_logo.dart';
import '../widgets/trust_badges.dart';
import '../widgets/category_grid.dart';
import '../widgets/location_search_modal.dart';
import '../widgets/date_picker_modal.dart';
import '../widgets/time_picker_modal.dart';
import 'searching_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String _pickupLocation = '';
  String _pickupCode = '';
  String _returnLocation = '';
  String _returnCode = '';
  DateTime _pickupDate = DateTime.now().add(const Duration(days: 1));
  DateTime _returnDate = DateTime.now().add(const Duration(days: 8));
  String _pickupTime = '10:00';
  String _dropoffTime = '10:00';
  bool _sameReturnLocation = true;
  bool _driverAge30_65 = true;
  int _driverAge = 30;

  String _formatDate(DateTime d) {
    return DateFormat('d MMM').format(d);
  }

  int _rentalDays(DateTime a, DateTime b) {
    return b.difference(a).inDays.clamp(1, 999);
  }

  void _handleSearch() {
    if (_pickupLocation.isEmpty) {
      _showLocationModal(true);
      return;
    }
    
    context.read<AppProvider>().setSearchCriteria(
      pickup: _pickupLocation,
      pickupCode: _pickupCode,
      dropoff: _sameReturnLocation ? _pickupLocation : _returnLocation,
      dropoffCode: _sameReturnLocation ? _pickupCode : _returnCode,
      pickupDate: _pickupDate,
      returnDate: _returnDate,
      pickupTime: _pickupTime,
      dropoffTime: _dropoffTime,
    );
    
    Navigator.push(context, MaterialPageRoute(builder: (context) => const SearchingScreen()));
  }

  void _showLocationModal(bool isPickup) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => LocationSearchModal(
        title: isPickup ? "Pickup Location" : "Return Location",
        onSelect: (loc) {
          setState(() {
            if (isPickup) {
              _pickupLocation = loc.name;
              _pickupCode = loc.value;
              if (_sameReturnLocation) {
                _returnLocation = loc.name;
                _returnCode = loc.value;
              }
            } else {
              _returnLocation = loc.name;
              _returnCode = loc.value;
            }
          });
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final topPadding = MediaQuery.of(context).padding.top;
    
    return Scaffold(
      backgroundColor: const Color(0xFFF0F4FF),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Column(
          children: [
            _buildHero(topPadding),
            _buildSearchCard(),
            const TrustBadges(),
            _buildSectionHeader("Browse by category"),
            CategoryGrid(onSelect: (cat) {
              if (_pickupLocation.isNotEmpty) {
                _handleSearch();
              } else {
                _showLocationModal(true);
              }
            }),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildHero(double topPadding) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.fromLTRB(20, topPadding + 16, 20, 72),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF060E1C), Color(0xFF0C1E3A), Color(0xFF123C69)],
        ),
      ),
      child: Stack(
        children: [
          // Decorative Orbs
          Positioned(
            top: -60,
            right: -60,
            child: Container(
              width: 220,
              height: 220,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white.withOpacity(0.07),
              ),
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Top Bar
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const HogiCarLogo(height: 24, isWhite: true),
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.white.withOpacity(0.2)),
                    ),
                    child: const Icon(Icons.notifications_none, color: Colors.white, size: 20),
                  ),
                ],
              ),
              const SizedBox(height: 28),
              Text(
                'Your journey starts here',
                style: GoogleFonts.inter(
                  fontSize: 13,
                  color: Colors.white.withOpacity(0.65),
                ),
              ),
              const SizedBox(height: 6),
              Text(
                'Find your\nperfect car',
                style: GoogleFonts.inter(
                  fontSize: 30,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                  height: 1.2,
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 18),
              // Stats Row
              Row(
                children: [
                  _buildStatItem("10,000+", "Cars"),
                  _buildStatItem("150+", "Locations"),
                  _buildStatItem("4.9★", "Rated"),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem(String val, String label) {
    return Expanded(
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 4),
        padding: const EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.1),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.white.withOpacity(0.12)),
        ),
        child: Column(
          children: [
            Text(
              val,
              style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w700, color: Colors.white),
            ),
            Text(
              label,
              style: GoogleFonts.inter(fontSize: 10, color: Colors.white.withOpacity(0.7)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSearchCard() {
    return Transform.translate(
      offset: const Offset(0, -36),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(24),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF1565C0).withOpacity(0.14),
                blurRadius: 24,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Column(
            children: [
              // Top Row
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    "Search Cars",
                    style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w700, color: const Color(0xFF1A1A2E)),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF0FDF4),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: const Color(0xFFBBF7D0)),
                    ),
                    child: Row(
                      children: [
                        Container(width: 6, height: 6, decoration: const BoxDecoration(color: Color(0xFF22C55E), shape: BoxShape.circle)),
                        const SizedBox(width: 5),
                        Text("Live deals", style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w600, color: const Color(0xFF15803D))),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              // Pickup Location
              _buildLocationField(
                label: "Pickup location",
                value: _pickupLocation.isEmpty ? "City, airport or station" : _pickupLocation,
                icon: Icons.location_on_outlined,
                iconBg: const Color(0xFFEEF4FF),
                iconColor: const Color(0xFF1565C0),
                onTap: () => _showLocationModal(true),
                isPlaceholder: _pickupLocation.isEmpty,
              ),
              // Same location toggle
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: Row(
                  children: [
                    Container(width: 36, height: 1, color: const Color(0xFFE5E7EB)),
                    const SizedBox(width: 10),
                    GestureDetector(
                      onTap: () => setState(() {
                        _sameReturnLocation = !_sameReturnLocation;
                        if (_sameReturnLocation) {
                          _returnLocation = _pickupLocation;
                          _returnCode = _pickupCode;
                        }
                      }),
                      child: Row(
                        children: [
                          _buildSwitch(_sameReturnLocation),
                          const SizedBox(width: 8),
                          Text("Same return location", style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF6B7280))),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              // Return Location
              if (!_sameReturnLocation)
                _buildLocationField(
                  label: "Return location",
                  value: _returnLocation.isEmpty ? "Different city or airport" : _returnLocation,
                  icon: Icons.location_on,
                  iconBg: const Color(0xFFF3F4F6),
                  iconColor: const Color(0xFF6B7280),
                  onTap: () => _showLocationModal(false),
                  isPlaceholder: _returnLocation.isEmpty,
                ),
              const Divider(color: Color(0xFFF3F4F6), height: 24),
              // Dates Row
              Row(
                children: [
                  _buildDateGroup("PICKUP", _pickupDate, _pickupTime, true),
                  _buildDurationBadge(),
                  _buildDateGroup("DROP-OFF", _returnDate, _dropoffTime, false),
                ],
              ),
              const Divider(color: Color(0xFFF3F4F6), height: 24),
              // Driver Age Toggle
              GestureDetector(
                onTap: () => setState(() => _driverAge30_65 = !_driverAge30_65),
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  child: Row(
                    children: [
                      Container(
                        width: 36,
                        height: 36,
                        decoration: BoxDecoration(color: const Color(0xFFF3F4F6), borderRadius: BorderRadius.circular(10)),
                        child: const Icon(Icons.person_outline, color: Color(0xFF6B7280), size: 18),
                      ),
                      const SizedBox(width: 12),
                      Expanded(child: Text("Driver age 30–65 years", style: GoogleFonts.inter(fontSize: 13, color: const Color(0xFF374151)))),
                      _buildSwitch(_driverAge30_65),
                    ],
                  ),
                ),
              ),
              if (!_driverAge30_65)
                Padding(
                  padding: const EdgeInsets.only(left: 48, top: 6),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text("Driver's age", style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w500, color: const Color(0xFF374151))),
                      Container(
                        decoration: BoxDecoration(color: const Color(0xFFEEF4FF), borderRadius: BorderRadius.circular(12)),
                        child: Row(
                          children: [
                            _buildCounterBtn(Icons.remove, () => setState(() => _driverAge = (_driverAge - 1).clamp(18, 99))),
                            SizedBox(width: 36, child: Center(child: Text("$_driverAge", style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w700, color: const Color(0xFF1565C0))))),
                            _buildCounterBtn(Icons.add, () => setState(() => _driverAge = (_driverAge + 1).clamp(18, 99))),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              const SizedBox(height: 14),
              // Search Button
              GestureDetector(
                onTap: _handleSearch,
                child: Container(
                  height: 56,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(18),
                    gradient: const LinearGradient(
                      colors: [Color(0xFF1565C0), Color(0xFF1976D2), Color(0xFF42A5F5)],
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.search, color: Colors.white, size: 20),
                      const SizedBox(width: 8),
                      Text("Search Cars", style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w700, color: Colors.white)),
                      const SizedBox(width: 8),
                      Container(
                        width: 30,
                        height: 30,
                        decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                        child: const Icon(Icons.arrow_forward, color: Color(0xFF1565C0), size: 16),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLocationField({
    required String label,
    required String value,
    required IconData icon,
    required Color iconBg,
    required Color iconColor,
    required VoidCallback onTap,
    bool isPlaceholder = false,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 10),
        child: Row(
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(color: iconBg, borderRadius: BorderRadius.circular(10)),
              child: Icon(icon, color: iconColor, size: 18),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(label, style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w500, color: const Color(0xFF9CA3AF), letterSpacing: 0.3)),
                  Text(
                    value,
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      fontWeight: isPlaceholder ? FontWeight.w400 : FontWeight.w600,
                      color: isPlaceholder ? const Color(0xFF9CA3AF) : const Color(0xFF1A1A2E),
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
            const Icon(Icons.chevron_right, color: Color(0xFFCBD5E1), size: 18),
          ],
        ),
      ),
    );
  }

  Widget _buildSwitch(bool on) {
    return Container(
      width: 38,
      height: 22,
      padding: const EdgeInsets.symmetric(horizontal: 2),
      decoration: BoxDecoration(
        color: on ? const Color(0xFF1565C0) : const Color(0xFFE5E7EB),
        borderRadius: BorderRadius.circular(11),
      ),
      alignment: on ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        width: 18,
        height: 18,
        decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle, boxShadow: [BoxShadow(color: Colors.black26, blurRadius: 2, offset: Offset(0, 1))]),
      ),
    );
  }

  Widget _buildDateGroup(String label, DateTime date, String time, bool isPickup) {
    return Expanded(
      child: Column(
        crossAxisAlignment: isPickup ? CrossAxisAlignment.start : CrossAxisAlignment.end,
        children: [
          Text(label, style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.w700, color: const Color(0xFF9CA3AF), letterSpacing: 1.5)),
          const SizedBox(height: 6),
          GestureDetector(
            onTap: () {
              showModalBottomSheet(
                context: context,
                backgroundColor: Colors.transparent,
                builder: (context) => DatePickerModal(
                  value: date,
                  minDate: isPickup ? DateTime.now() : _pickupDate.add(const Duration(days: 1)),
                  title: isPickup ? "Pickup Date" : "Drop-off Date",
                  onSelect: (d) {
                    setState(() {
                      if (isPickup) {
                        _pickupDate = d;
                        if (_returnDate.isBefore(_pickupDate)) {
                          _returnDate = _pickupDate.add(const Duration(days: 7));
                        }
                      } else {
                        _returnDate = d;
                      }
                    });
                  },
                ),
              );
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
              decoration: BoxDecoration(color: const Color(0xFFEEF4FF), borderRadius: BorderRadius.circular(10)),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.calendar_today, size: 12, color: Color(0xFF1565C0)),
                  const SizedBox(width: 5),
                  Text(_formatDate(date), style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: const Color(0xFF1565C0))),
                ],
              ),
            ),
          ),
          const SizedBox(height: 6),
          GestureDetector(
            onTap: () {
              showModalBottomSheet(
                context: context,
                backgroundColor: Colors.transparent,
                builder: (context) => TimePickerModal(
                  title: isPickup ? "Pickup Time" : "Drop-off Time",
                  selectedTime: time,
                  onSelect: (t) {
                    setState(() {
                      if (isPickup) _pickupTime = t;
                      else _dropoffTime = t;
                    });
                  },
                ),
              );
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
              decoration: BoxDecoration(color: const Color(0xFFF9FAFB), borderRadius: BorderRadius.circular(8), border: Border.all(color: const Color(0xFFE5E7EB))),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.access_time, size: 12, color: Color(0xFF6B7280)),
                  const SizedBox(width: 5),
                  Text(time, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w500, color: const Color(0xFF374151))),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDurationBadge() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8),
      child: Column(
        children: [
          const Icon(Icons.arrow_forward, size: 14, color: Color(0xFF1565C0)),
          Text("${_rentalDays(_pickupDate, _returnDate)}d", style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w700, color: const Color(0xFF1565C0))),
        ],
      ),
    );
  }

  Widget _buildCounterBtn(IconData icon, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      child: SizedBox(width: 34, height: 34, child: Icon(icon, size: 16, color: const Color(0xFF1565C0))),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 24, 20, 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(title, style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w700, color: const Color(0xFF1A1A2E))),
          Text("View all", style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w500, color: const Color(0xFF1565C0))),
        ],
      ),
    );
  }
}
