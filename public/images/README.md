# Course Green Images

Place your course green slope images in the corresponding folders:

## Directory Structure
```
public/images/
├── pebble-beach/
│   ├── hole-1.jpg
│   ├── hole-2.jpg
│   └── ...
├── augusta/
│   ├── hole-1.jpg
│   ├── hole-2.jpg
│   └── ...
├── st-andrews/
│   ├── hole-1.jpg
│   ├── hole-2.jpg
│   └── ...
└── pine-valley/
    ├── hole-1.jpg
    ├── hole-2.jpg
    └── ...
```

## Image Requirements
- Format: JPG, PNG, or WebP
- Recommended size: 800x600px or similar aspect ratio
- Name format: `hole-{number}.jpg` (e.g., hole-1.jpg, hole-2.jpg)

## Adding More Courses
1. Create a new folder in `public/images/` with the course name (use hyphens for spaces)
2. Add hole images following the naming convention
3. Update `src/components/Header.tsx` to add the course to the list
4. Update `src/pages/CourseGreens.tsx` to add the course data

If images are not available, placeholder images will be shown automatically.
