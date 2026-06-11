import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class StepIndicator extends StatelessWidget {
  final int currentStep;
  const StepIndicator({super.key, required this.currentStep});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.fromLTRB(20, MediaQuery.of(context).padding.top + 12, 20, 16),
      color: Colors.white,
      child: Row(
        children: [
          _buildStep(0, "Details"),
          _buildDivider(0),
          _buildStep(1, "Payment"),
          _buildDivider(1),
          _buildStep(2, "Confirm"),
        ],
      ),
    );
  }

  Widget _buildStep(int step, String label) {
    final active = currentStep == step;
    final done = currentStep > step;

    return Row(
      children: [
        Container(
          width: 24,
          height: 24,
          decoration: BoxDecoration(
            color: active || done ? const Color(0xFF123C69) : Colors.white,
            shape: BoxShape.circle,
            border: Border.all(color: active || done ? const Color(0xFF123C69) : const Color(0xFFD1D5DB)),
          ),
          child: Center(
            child: done
                ? const Icon(Icons.check, size: 14, color: Colors.white)
                : Text(
                    "${step + 1}",
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: active ? Colors.white : const Color(0xFFD1D5DB),
                    ),
                  ),
          ),
        ),
        const SizedBox(width: 8),
        Text(
          label,
          style: GoogleFonts.inter(
            fontSize: 13,
            fontWeight: active ? FontWeight.w600 : FontWeight.w400,
            color: active ? const Color(0xFF1A1A2E) : const Color(0xFF9CA3AF),
          ),
        ),
      ],
    );
  }

  Widget _buildDivider(int step) {
    final done = currentStep > step;
    return Expanded(
      child: Container(
        height: 1,
        margin: const EdgeInsets.symmetric(horizontal: 12),
        color: done ? const Color(0xFF123C69) : const Color(0xFFE5E7EB),
      ),
    );
  }
}
