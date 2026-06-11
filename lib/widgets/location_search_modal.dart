import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/location_suggestion.dart';
import '../services/api_service.dart';

class LocationSearchModal extends StatefulWidget {
  final String title;
  final Function(LocationSuggestion) onSelect;

  const LocationSearchModal({
    super.key,
    required this.title,
    required this.onSelect,
  });

  @override
  State<LocationSearchModal> createState() => _LocationSearchModalState();
}

class _LocationSearchModalState extends State<LocationSearchModal> {
  final _searchController = TextEditingController();
  final ApiService _apiService = ApiService();
  List<LocationSuggestion> _results = [];
  bool _isLoading = false;

  Future<void> _performSearch(String query) async {
    if (query.length < 2) {
      setState(() => _results = []);
      return;
    }
    setState(() => _isLoading = true);
    try {
      final results = await _apiService.searchLocations(query);
      setState(() {
        _results = results;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.9,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        children: [
          const SizedBox(height: 12),
          Container(
            width: 36,
            height: 4,
            decoration: BoxDecoration(
              color: const Color(0xFFE5E7EB),
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: 16),
          Text(
            widget.title,
            style: GoogleFonts.inter(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: const Color(0xFF1A1A2E),
            ),
          ),
          const SizedBox(height: 16),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: TextField(
              controller: _searchController,
              autofocus: true,
              onChanged: _performSearch,
              decoration: InputDecoration(
                hintText: 'Search city or airport...',
                prefixIcon: const Icon(Icons.search, color: Color(0xFF9CA3AF)),
                filled: true,
                fillColor: const Color(0xFFF3F4F6),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: BorderSide.none,
                ),
                contentPadding: const EdgeInsets.symmetric(vertical: 14),
              ),
              style: GoogleFonts.inter(fontSize: 16, color: const Color(0xFF1A1A2E)),
            ),
          ),
          if (_isLoading)
            const LinearProgressIndicator(
              backgroundColor: Colors.white,
              valueColor: AlwaysStoppedAnimation(Color(0xFF123C69)),
            ),
          const SizedBox(height: 8),
          Expanded(
            child: _results.isEmpty && _searchController.text.isEmpty
                ? _buildPopularDestinations()
                : ListView.builder(
                    itemCount: _results.length,
                    itemBuilder: (context, index) {
                      final loc = _results[index];
                      return ListTile(
                        leading: Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: const Color(0xFFEEF4FF),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Icon(
                            loc.type == 'airport' ? Icons.local_airport : Icons.location_on,
                            color: const Color(0xFF1565C0),
                            size: 20,
                          ),
                        ),
                        title: Text(
                          loc.name,
                          style: GoogleFonts.inter(
                            fontSize: 15,
                            fontWeight: FontWeight.w600,
                            color: const Color(0xFF1A1A2E),
                          ),
                        ),
                        subtitle: Text(
                          '${loc.iataCode} • ${loc.municipality}',
                          style: GoogleFonts.inter(
                            fontSize: 12,
                            color: const Color(0xFF6B7280),
                          ),
                        ),
                        onTap: () {
                          widget.onSelect(loc);
                          Navigator.pop(context);
                        },
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildPopularDestinations() {
    final popular = [
      {'name': 'Dubai International Airport', 'code': 'DXB', 'city': 'Dubai', 'type': 'airport'},
      {'name': 'London Heathrow Airport', 'code': 'LHR', 'city': 'London', 'type': 'airport'},
      {'name': 'Paris Charles de Gaulle', 'code': 'CDG', 'city': 'Paris', 'type': 'airport'},
      {'name': 'New York JFK Airport', 'code': 'JFK', 'city': 'New York', 'type': 'airport'},
    ];

    return ListView(
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 12, 20, 8),
          child: Text(
            'POPULAR DESTINATIONS',
            style: GoogleFonts.inter(
              fontSize: 11,
              fontWeight: FontWeight.w700,
              color: const Color(0xFF9CA3AF),
              letterSpacing: 1.5,
            ),
          ),
        ),
        ...popular.map((loc) => ListTile(
          leading: Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: const Color(0xFFF3F4F6),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(
              loc['type'] == 'airport' ? Icons.local_airport : Icons.location_on,
              color: const Color(0xFF6B7280),
              size: 20,
            ),
          ),
          title: Text(
            loc['name']!,
            style: GoogleFonts.inter(
              fontSize: 15,
              fontWeight: FontWeight.w600,
              color: const Color(0xFF1A1A2E),
            ),
          ),
          subtitle: Text(
            '${loc['code']} • ${loc['city']}',
            style: GoogleFonts.inter(
              fontSize: 12,
              color: const Color(0xFF6B7280),
            ),
          ),
          onTap: () {
            widget.onSelect(LocationSuggestion(
              value: loc['code']!,
              label: '${loc['name']}, ${loc['city']} (${loc['code']})',
              iataCode: loc['code']!,
              name: loc['name']!,
              municipality: loc['city']!,
              countryCode: '',
              type: loc['type']!,
            ));
            Navigator.pop(context);
          },
        )),
      ],
    );
  }
}
