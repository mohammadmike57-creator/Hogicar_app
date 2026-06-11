import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class DatePickerModal extends StatefulWidget {
  final DateTime value;
  final DateTime? minDate;
  final String title;
  final Function(DateTime) onSelect;

  const DatePickerModal({
    super.key,
    required this.value,
    this.minDate,
    this.title = "Select Date",
    required this.onSelect,
  });

  @override
  State<DatePickerModal> createState() => _DatePickerModalState();
}

class _DatePickerModalState extends State<DatePickerModal> {
  late DateTime _viewDate;
  late DateTime _min;

  final List<String> _days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  final List<String> _months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  @override
  void initState() {
    super.initState();
    _viewDate = DateTime(widget.value.year, widget.value.month, 1);
    _min = widget.minDate ?? DateTime.now();
    _min = DateTime(_min.year, _min.month, _min.day);
  }

  void _prevMonth() {
    setState(() {
      _viewDate = DateTime(_viewDate.year, _viewDate.month - 1, 1);
    });
  }

  void _nextMonth() {
    setState(() {
      _viewDate = DateTime(_viewDate.year, _viewDate.month + 1, 1);
    });
  }

  bool _isSelected(int day) {
    return widget.value.day == day &&
        widget.value.month == _viewDate.month &&
        widget.value.year == _viewDate.year;
  }

  bool _isDisabled(int day) {
    final d = DateTime(_viewDate.year, _viewDate.month, day);
    return d.isBefore(_min);
  }

  @override
  Widget build(BuildContext context) {
    final daysInMonth = DateUtils.getDaysInMonth(_viewDate.year, _viewDate.month);
    final firstDayOffset = DateTime(_viewDate.year, _viewDate.month, 1).weekday % 7;

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
            widget.title,
            style: GoogleFonts.inter(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: const Color(0xFF1A1A2E),
            ),
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              IconButton(
                onPressed: _prevMonth,
                icon: const Icon(Icons.chevron_left, color: Color(0xFF1A1A2E)),
                style: IconButton.styleFrom(
                  backgroundColor: const Color(0xFFF3F4F6),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
              ),
              Text(
                "${_months[_viewDate.month - 1]} ${_viewDate.year}",
                style: GoogleFonts.inter(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: const Color(0xFF1A1A2E),
                ),
              ),
              IconButton(
                onPressed: _nextMonth,
                icon: const Icon(Icons.chevron_right, color: Color(0xFF1A1A2E)),
                style: IconButton.styleFrom(
                  backgroundColor: const Color(0xFFF3F4F6),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: _days.map((d) => Expanded(
              child: Center(
                child: Text(
                  d,
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                    color: const Color(0xFF9CA3AF),
                  ),
                ),
              ),
            )).toList(),
          ),
          const SizedBox(height: 8),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 7,
              mainAxisSpacing: 4,
              crossAxisSpacing: 4,
            ),
            itemCount: daysInMonth + firstDayOffset,
            itemBuilder: (context, index) {
              if (index < firstDayOffset) return const SizedBox.shrink();
              final day = index - firstDayOffset + 1;
              final selected = _isSelected(day);
              final disabled = _isDisabled(day);

              return GestureDetector(
                onTap: disabled ? null : () {
                  widget.onSelect(DateTime(_viewDate.year, _viewDate.month, day));
                  Navigator.pop(context);
                },
                child: Container(
                  decoration: BoxDecoration(
                    color: selected ? const Color(0xFF123C69) : Colors.transparent,
                    shape: BoxShape.circle,
                  ),
                  child: Center(
                    child: Text(
                      "$day",
                      style: GoogleFonts.inter(
                        fontSize: 15,
                        fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
                        color: selected 
                          ? Colors.white 
                          : (disabled ? const Color(0xFF9CA3AF).withOpacity(0.3) : const Color(0xFF1A1A2E)),
                      ),
                    ),
                  ),
                ),
              );
            },
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: TextButton(
              onPressed: () => Navigator.pop(context),
              style: TextButton.styleFrom(
                backgroundColor: const Color(0xFFF3F4F6),
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: Text(
                "Cancel",
                style: GoogleFonts.inter(
                  fontSize: 15,
                  fontWeight: FontWeight.w500,
                  color: const Color(0xFF6B7280),
                ),
              ),
            ),
          ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }
}
