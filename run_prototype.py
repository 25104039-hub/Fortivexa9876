#!/usr/bin/env python3
"""
FORTIVEXA - Smart India Hackathon 2026 Final Round Prototype Runner
Problem Statement ID: SIH26184
Title: Development of a Predictive Analytics Framework for Cybercrime Complaints
Stage: TRL 5 - Technology Validated in Relevant Environment
Team ID: 25 | Team Name: FORTIVEXA
"""

import http.server
import socketserver
import webbrowser
import os
import sys
import threading
import time

PORT = 8080
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
APP_DIR = os.path.join(BASE_DIR, "app")

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=APP_DIR, **kwargs)

    def log_message(self, format, *args):
        # Clean logging
        sys.stderr.write(f"[{time.strftime('%H:%M:%S')}] {format % args}\n")

def find_available_port(start_port=8080):
    import socket
    port = start_port
    while port < start_port + 50:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(('127.0.0.1', port)) != 0:
                return port
            port += 1
    return start_port

def main():
    port = find_available_port(PORT)
    url = f"http://localhost:{port}"

    print("=" * 76)
    print("  FORTIVEXA - Cybercrime Predictive Intelligence Platform")
    print("  Smart India Hackathon (SIH) 2026 Final Round Prototype")
    print("  Problem Statement ID : SIH26184 (Ministry of Home Affairs / I4C)")
    print("  Team ID / Name       : 25 / FORTIVEXA")
    print("  Stage                : TRL 5 - Technology Validated in Relevant Environment")
    print("=" * 76)
    print(f"  [+] Starting Web Application Server on {url} ...")
    print(f"  [+] Serving files from: {APP_DIR}")
    print(f"  [+] Zero external dependencies required (Pure Python 3 standard library).")
    print("=" * 76)

    # Launch browser after 1 second
    def open_browser():
        time.sleep(1.0)
        print(f"  [+] Opening web browser to {url} ...")
        webbrowser.open(url)

    threading.Thread(target=open_browser, daemon=True).start()

    with socketserver.TCPServer(("", port), CustomHandler) as httpd:
        print(f"  [OK] Server is live! Press Ctrl+C in this window to stop.")
        print("=" * 76)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n  [!] Server shutting down gracefully. Good luck in SIH!")

if __name__ == "__main__":
    main()
