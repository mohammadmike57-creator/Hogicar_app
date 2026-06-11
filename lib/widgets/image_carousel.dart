import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';

class ImageCarousel extends StatefulWidget {
  final List<String> images;
  const ImageCarousel({super.key, required this.images});

  @override
  State<ImageCarousel> createState() => _ImageCarouselState();
}

class _ImageCarouselState extends State<ImageCarousel> {
  final PageController _controller = PageController();

  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.bottomCenter,
      children: [
        SizedBox(
          height: 240,
          child: PageView.builder(
            controller: _controller,
            itemCount: widget.images.isEmpty ? 1 : widget.images.length,
            itemBuilder: (context, index) {
              final img = widget.images.isEmpty ? '' : widget.images[index];
              return Container(
                color: const Color(0xFFF9FAFB),
                child: img.startsWith('http')
                    ? CachedNetworkImage(
                        imageUrl: img,
                        fit: BoxFit.contain,
                        placeholder: (context, url) => const Center(child: CircularProgressIndicator()),
                        errorWidget: (context, url, error) => Image.asset('assets/images/car-sedan.png', fit: BoxFit.contain),
                      )
                    : Image.asset(
                        img.isNotEmpty ? img : 'assets/images/car-sedan.png',
                        fit: BoxFit.contain,
                      ),
              );
            },
          ),
        ),
        if (widget.images.length > 1)
          Positioned(
            bottom: 16,
            child: SmoothPageIndicator(
              controller: _controller,
              count: widget.images.length,
              effect: const ExpandingDotsEffect(
                dotHeight: 6,
                dotWidth: 6,
                activeDotColor: Color(0xFF123C69),
                dotColor: Color(0xFFD1D5DB),
              ),
            ),
          ),
      ],
    );
  }
}
