import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import 'package:google_fonts/google_fonts.dart';
import '../providers/app_provider.dart';
import '../widgets/vehicle_card.dart';
import '../widgets/filter_modal.dart';
import '../widgets/skeleton_card.dart';
import 'car_details_screen.dart';

class SearchResultsScreen extends StatefulWidget {
  const SearchResultsScreen({super.key});

  @override
  State<SearchResultsScreen> createState() => _SearchResultsScreenState();
}

class _SearchResultsScreenState extends State<SearchResultsScreen> {
  String _sortBy = "cheapest"; // cheapest, best_rated, closest
  Map<String, dynamic> _filters = {
    'transmission': 'All',
    'fuelType': 'All',
    'minRating': 0.0,
  };

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AppProvider>();
    final bottomPadding = MediaQuery.of(context).padding.bottom;

    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FB),
      body: Column(
        children: [
          _buildSummaryBar(provider),
          _buildControlRow(),
          Expanded(
            child: provider.isLoading
                ? ListView.builder(
                    itemCount: 4,
                    itemBuilder: (context, index) => const SkeletonCard(),
                  )
                : provider.filteredCars.isEmpty
                    ? _buildEmptyState()
                    : ListView.builder(
                        padding: const EdgeInsets.only(top: 8, bottom: 20),
                        itemCount: provider.filteredCars.length,
                        itemBuilder: (context, index) {
                          final car = provider.filteredCars[index];
                          final rentalDays = provider.returnDate!.difference(provider.pickupDate!).inDays.clamp(1, 999);
                          return VehicleCard(
                            car: car,
                            rentalDays: rentalDays,
                            onPress: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => CarDetailsScreen(car: car),
                                ),
                              );
                            },
                          );
                        },
                      ),
          ),
          SizedBox(height: bottomPadding),
        ],
      ),
    );
  }

  Widget _buildSummaryBar(AppProvider provider) {
    final dateFormat = DateFormat('d MMM');
    final pickupStr = provider.pickupDate != null ? dateFormat.format(provider.pickupDate!) : "";
    final returnStr = provider.returnDate != null ? dateFormat.format(provider.returnDate!) : "";
    final days = provider.returnDate?.difference(provider.pickupDate ?? DateTime.now()).inDays.clamp(1, 999) ?? 1;

    return Container(
      padding: EdgeInsets.fromLTRB(16, MediaQuery.of(context).padding.top + 12, 16, 12),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(bottom: BorderSide(color: Color(0xFFE5E7EB))),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  provider.pickupLocation.isEmpty ? "Any Location" : provider.pickupLocation,
                  style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w600, color: const Color(0xFF1A1A2E)),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                Text(
                  "$pickupStr – $returnStr · $days ${days == 1 ? "day" : "days"}",
                  style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF6B7280)),
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          GestureDetector(
            onTap: () => Navigator.pop(context),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(color: const Color(0xFFEEF4FF), borderRadius: BorderRadius.circular(8)),
              child: Text("Edit", style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w500, color: const Color(0xFF1565C0))),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildControlRow() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(bottom: BorderSide(color: Color(0xFFE5E7EB))),
      ),
      child: Row(
        children: [
          Expanded(
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _buildSortTab("Cheapest", "cheapest"),
                  _buildSortTab("Best Rated", "best_rated"),
                  _buildSortTab("Closest", "closest"),
                ],
              ),
            ),
          ),
          const SizedBox(width: 10),
          GestureDetector(
            onTap: () {
              showModalBottomSheet(
                context: context,
                isScrollControlled: true,
                backgroundColor: Colors.transparent,
                builder: (context) => FilterModal(
                  filters: _filters,
                  onApply: (f) => setState(() => _filters = f),
                ),
              );
            },
            child: Container(
              width: 38,
              height: 38,
              decoration: BoxDecoration(color: const Color(0xFFF3F4F6), borderRadius: BorderRadius.circular(10)),
              child: const Icon(Icons.tune, size: 18, color: Color(0xFF1A1A2E)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSortTab(String label, String key) {
    final active = _sortBy == key;
    return GestureDetector(
      onTap: () => setState(() => _sortBy = key),
      child: Container(
        margin: const EdgeInsets.only(right: 6),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
        decoration: BoxDecoration(
          color: active ? const Color(0xFF123C69) : Colors.transparent,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: active ? const Color(0xFF123C69) : const Color(0xFFE5E7EB)),
        ),
        child: Text(
          label,
          style: GoogleFonts.inter(
            fontSize: 12,
            fontWeight: FontWeight.w500,
            color: active ? Colors.white : const Color(0xFF6B7280),
          ),
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.search, size: 48, color: Color(0xFFE5E7EB)),
          const SizedBox(height: 16),
          Text("No cars found", style: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.w600, color: const Color(0xFF1A1A2E))),
          Text("Try adjusting your filters", style: GoogleFonts.inter(fontSize: 14, color: const Color(0xFF6B7280))),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () => setState(() {
              _filters = {'transmission': 'All', 'fuelType': 'All', 'minRating': 0.0};
            }),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF123C69),
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            child: const Text("Clear Filters"),
          ),
        ],
      ),
    );
  }
}
