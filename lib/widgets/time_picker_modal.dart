import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class TimePickerModal extends StatelessWidget {
  final String title;
  final String selectedTime;
  final List<String> times = [
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
    "18:00", "19:00", "20:00",
  ];
  final Function(String) onSelect;

  TimePickerModal({
    super.key,
    required this.title,
    required this.selectedTime,
    required this.onSelect,
  });

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
        children: [
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
            title,
            style: GoogleFonts.inter(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: const Color(0xFF1A1A2E),
            ),
          ),
          const SizedBox(height: 16),
          Flexible(
            child: ListView.builder(
              shrinkWrap: true,
              itemCount: times.length,
              itemBuilder: (context, index) {
                final time = times[index];
                final selected = time == selectedTime;
                return ListTile(
                  title: Text(
                    time,
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
                      color: selected ? const Color(0xFF1565C0) : const Color(0xFF1A1A2E),
                    ),
                  ),
                  trailing: selected ? const Icon(Icons.check, color: Color(0xFF1565C0)) : null,
                  onTap: () {
                    onSelect(time);
                    Navigator.pop(context);
                  },
                  selected: selected,
                  selectedTileColor: const Color(0xFFEEF4FF),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                );
              },
            ),
          ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }
}
