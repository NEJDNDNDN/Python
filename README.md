import tkinter as tk
from tkinter import filedialog, messagebox
import os
import shutil

# Function to choose the folder to save the file
def choose_save_folder():
    folder_selected = filedialog.askdirectory(title="Choose the folder to save the file")
    return folder_selected

# Function to decrypt the file
def decrypt_file():
    file_path = file_path_entry.get()
    if not file_path:
        messagebox.showerror("Error", "Please select a file to decrypt")
        return
    
    try:
        # Choose the save folder
        save_folder = choose_save_folder()
        if not save_folder:
            messagebox.showerror("Error", "Please select a folder to save the file")
            return

        # Decryption logic: replace this with actual decryption logic
        # For example: decrypt_file_logic(file_path)

        # Assuming the file was decrypted and saved in the same folder
        decrypted_file_path = os.path.join(save_folder, "decrypted_file.txt")
        shutil.copy(file_path, decrypted_file_path)  # Copy the encrypted file to the decrypted file

        # Success message
        messagebox.showinfo("Success", f"The file has been decrypted and saved at: {decrypted_file_path}")
    except Exception as e:
        messagebox.showerror("Error", f"An error occurred during decryption: {str(e)}")

# Function to browse the file
def browse_file():
    filename = filedialog.askopenfilename(filetypes=[("Encrypted Files", "*.enc")])
    file_path_entry.delete(0, tk.END)
    file_path_entry.insert(0, filename)

# Setting up the UI
window = tk.Tk()
window.title("Python File Decryption Tool")
window.geometry("450x400")
window.config(bg="#2b2b2b")  # Dark background

# Title
title_label = tk.Label(window, text="File Decryption Tool", font=("Helvetica", 16), bg="#2b2b2b", fg="#ffffff")
title_label.pack(pady=20)

# File path input
file_path_label = tk.Label(window, text="Encrypted File Path:", font=("Helvetica", 12), bg="#2b2b2b", fg="#ffffff")
file_path_label.pack(pady=5)

file_path_entry = tk.Entry(window, font=("Helvetica", 12), width=40)
file_path_entry.pack(pady=5)

# Browse button
browse_button = tk.Button(window, text="Choose File", font=("Helvetica", 12), command=browse_file)
browse_button.pack(pady=10)

# Decrypt button
decrypt_button = tk.Button(window, text="Decrypt", font=("Helvetica", 12), bg="#4CAF50", fg="white", command=decrypt_file)
decrypt_button.pack(pady=20)

# Footer with user rights
footer_label = tk.Label(window, text="𝑫𝑨𝑹𝑲 𝑯𝑨𝑪𝑲𝑬𝑹", font=("Helvetica", 10), bg="#2b2b2b", fg="#ffffff")
footer_label.pack(side=tk.BOTTOM, pady=10)

# Run the application
window.mainloop()
