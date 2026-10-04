import os
import sys
import time
import subprocess
import webbrowser

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    venv_dir = os.path.join(base_dir, "backend", ".venv")
    
    is_win = sys.platform == "win32"
    if is_win:
        venv_python = os.path.join(venv_dir, "Scripts", "python.exe")
        venv_pip = os.path.join(venv_dir, "Scripts", "pip.exe")
    else:
        venv_python = os.path.join(venv_dir, "bin", "python")
        venv_pip = os.path.join(venv_dir, "bin", "pip")

    # 1. Create Virtual Environment if missing
    if not os.path.exists(venv_python):
        print(">>> Creating Python virtual environment in backend/.venv ...")
        subprocess.run([sys.executable, "-m", "venv", venv_dir], check=True)
        print(">>> Virtual environment created successfully.")
        
        req_file = os.path.join(base_dir, "backend", "requirements.txt")
        print(">>> Installing backend requirements from requirements.txt ...")
        subprocess.run([venv_pip, "install", "-r", req_file], check=True)
        print(">>> Backend dependencies installed successfully.")

    # 2. Check Node Modules
    node_modules_dir = os.path.join(base_dir, "node_modules")
    if not os.path.exists(node_modules_dir):
        print(">>> Installing frontend dependencies via npm install ...")
        npm_bin = "npm.cmd" if is_win else "npm"
        subprocess.run([npm_bin, "install"], cwd=base_dir, check=True)
        print(">>> Frontend dependencies installed successfully.")

    # 3. Start FastAPI Backend Process
    print("\n>>> Launching FastAPI Backend on http://localhost:8000 ...")
    backend_cmd = [venv_python, "-m", "uvicorn", "backend.app.main:app", "--host", "127.0.0.1", "--port", "8000"]
    backend_process = subprocess.Popen(backend_cmd, cwd=base_dir)

    # 4. Start Next.js Frontend Process
    print(">>> Launching Next.js Frontend on http://localhost:3000 ...")
    npm_bin = "npm.cmd" if is_win else "npm"
    frontend_process = subprocess.Popen([npm_bin, "run", "dev"], cwd=base_dir)

    # 5. Wait for servers to initialize and open browser
    print(">>> Waiting 4 seconds for servers to start...")
    time.sleep(4)
    print(">>> Opening http://localhost:3000 in your default web browser...")
    webbrowser.open("http://localhost:3000")

    print("\n" + "=" * 65)
    print("  TECH PIRATES - Temporal Network World Model Application Running")
    print("  -------------------------------------------------------------")
    print("  * Frontend Dashboard:  http://localhost:3000")
    print("  * Backend API Docs:    http://localhost:8000/docs")
    print("  * Health Endpoint:     http://localhost:8000/api/v1/health")
    print("  -------------------------------------------------------------")
    print("  Press Ctrl+C in this terminal to stop both servers.")
    print("=" * 65 + "\n")

    try:
        backend_process.wait()
        frontend_process.wait()
    except KeyboardInterrupt:
        print("\n>>> Shutting down Backend and Frontend servers...")
        backend_process.terminate()
        frontend_process.terminate()
        print(">>> Servers stopped successfully.")

if __name__ == "__main__":
    main()
