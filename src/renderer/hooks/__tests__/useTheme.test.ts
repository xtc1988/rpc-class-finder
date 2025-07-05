import { renderHook, act } from "@testing-library/react";
import { useTheme } from "../useTheme";

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

describe("useTheme", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initializes with light theme by default", () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    
    const { result } = renderHook(() => useTheme());
    
    expect(result.current.theme).toBe("light");
  });

  it("initializes with saved theme from localStorage", () => {
    mockLocalStorage.getItem.mockReturnValue("dark");
    
    const { result } = renderHook(() => useTheme());
    
    expect(result.current.theme).toBe("dark");
  });

  it("toggles from light to dark theme", () => {
    mockLocalStorage.getItem.mockReturnValue("light");
    
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.toggleTheme();
    });
    
    expect(result.current.theme).toBe("dark");
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith("theme", "dark");
  });

  it("toggles from dark to light theme", () => {
    mockLocalStorage.getItem.mockReturnValue("dark");
    
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.toggleTheme();
    });
    
    expect(result.current.theme).toBe("light");
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith("theme", "light");
  });

  it("calls localStorage.getItem with correct key", () => {
    renderHook(() => useTheme());
    
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith("theme");
  });

  it("saves theme to localStorage when toggling", () => {
    mockLocalStorage.getItem.mockReturnValue("light");
    
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.toggleTheme();
    });
    
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith("theme", "dark");
  });
});
