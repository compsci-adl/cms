from PIL import Image, ImageOps
import os

def convert_and_compress_images(input_dir, output_quality=75, max_size=1600):
    for root, _, files in os.walk(input_dir):
        for filename in files:
            if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
                file_path = os.path.join(root, filename)
                with Image.open(file_path) as img:
                    # Apply EXIF orientation
                    img = ImageOps.exif_transpose(img)
                    
                    # Calculate the new size maintaining the aspect ratio
                    width, height = img.size
                    if width > height:
                        new_width = max_size
                        new_height = int((max_size / width) * height)
                    else:
                        new_height = max_size
                        new_width = int((max_size / height) * width)
                    
                    img = img.resize((new_width, new_height), Image.LANCZOS)
                    
                    # Save the image in WebP format with the specified quality
                    new_filename = os.path.splitext(filename)[0] + '.webp'
                    new_file_path = os.path.join(root, new_filename)
                    img.save(new_file_path, 'webp', quality=output_quality)
                    
                    # Remove the original file
                    os.remove(file_path)

if __name__ == "__main__":
    input_directory = 'images'
    convert_and_compress_images(input_directory)