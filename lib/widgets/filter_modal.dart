import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class FilterModal extends StatefulWidget {
  final Map<String, dynamic> filters;
  final List<String> availableSuppliers;
  final Function(Map<String, dynamic>) onApply;

  const FilterModal({
    super.key,
    required this.filters,
    required this.availableSuppliers,
    required this.onApply,
  });

  @override
  State<FilterModal> createState() => _FilterModalState();
}

class _FilterModalState extends State<FilterModal> {
  late String _transmission;
  late String _fuelType;
  late double _minRating;
  late List<String> _selectedSuppliers;

  @override
  void initState() {
    super.initState();
    _transmission = widget.filters['transmission'] ?? 'All';
    _fuelType = widget.filters['fuelType'] ?? 'All';
    _minRating = (widget.filters['minRating'] ?? 0.0).toDouble();
    _selectedSuppliers = List<String>.from(widget.filters['suppliers'] ?? []);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Container(
              width: 36,
              height: 4,
              decoration: BoxDecoration(color: const Color(0xFFE5E7EB), borderRadius: BorderRadius.circular(2)),
            ),
          ),
          const SizedBox(height: 16),
          Text("Filters", style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w700, color: const Color(0xFF1A1A2E))),
          const SizedBox(height: 24),
          Text("Suppliers", style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: const Color(0xFF1A1A2E))),
          const SizedBox(height: 12),
          SizedBox(
            height: 40,
            child: ListView(
              scrollDirection: Axis.horizontal,
              children: widget.availableSuppliers.map((s) {
                final isSelected = _selectedSuppliers.contains(s);
                return _buildOptionChip("supplier", s, isSelected);
              }).toList(),
            ),
          ),
          const SizedBox(height: 24),
          Text("Transmission", style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: const Color(0xFF1A1A2E))),
          const SizedBox(height: 12),
          Row(
            children: ["All", "Manual", "Automatic"].map((t) => _buildOptionChip("transmission", t, _transmission == t)).toList(),
          ),
          const SizedBox(height: 24),
          Text("Fuel Type", style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: const Color(0xFF1A1A2E))),
          const SizedBox(height: 12),
          Row(
            children: ["All", "Petrol", "Diesel", "Electric"].map((f) => _buildOptionChip("fuelType", f, _fuelType == f)).toList(),
          ),
          const SizedBox(height: 24),
          Text("Minimum Rating: ${_minRating.toStringAsFixed(1)}+", style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: const Color(0xFF1A1A2E))),
          Slider(
            value: _minRating,
            min: 0,
            max: 9,
            divisions: 9,
            activeColor: const Color(0xFF123C69),
            onChanged: (v) => setState(() => _minRating = v),
          ),
          const SizedBox(height: 32),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {
                widget.onApply({
                  'transmission': _transmission,
                  'fuelType': _fuelType,
                  'minRating': _minRating,
                  'suppliers': _selectedSuppliers,
                });
                Navigator.pop(context);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF123C69),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: Text("Apply Filters", style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w700)),
            ),
          ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }

  Widget _buildOptionChip(String type, String label, bool selected) {
    return GestureDetector(
      onTap: () => setState(() {
        if (type == 'transmission') {
          _transmission = label;
        } else if (type == 'fuelType') {
          _fuelType = label;
        } else if (type == 'supplier') {
          if (_selectedSuppliers.contains(label)) {
            _selectedSuppliers.remove(label);
          } else {
            _selectedSuppliers.add(label);
          }
        }
      }),
      child: Container(
        margin: const EdgeInsets.only(right: 8),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: selected ? const Color(0xFF123C69) : const Color(0xFFF3F4F6),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Text(
          label,
          style: GoogleFonts.inter(
            fontSize: 13,
            fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
            color: selected ? Colors.white : const Color(0xFF6B7280),
          ),
        ),
      ),
    );
  }
}
