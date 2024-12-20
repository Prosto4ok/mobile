import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	TextInput,
	Button,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';



export default function CalculatorScreen() {
	const [operation, setOperation] = useState("2"); // Default to "Кубатура досок"
	const [calculationType, setCalculationType] = useState("volume"); // 'volume' for Кубах or 'pieces' for По штукам
	const [woodType, setWoodType] = useState("520"); // Default wood density for Pine
	const [shape, setShape] = useState("rectangular"); // 'rectangular' or 'round'
	const [width, setWidth] = useState("");
	const [thickness, setThickness] = useState("");
	const [length, setLength] = useState("");
	const [diameter, setDiameter] = useState("");
	const [quantity, setQuantity] = useState(""); // This will be either volume in cubic meters or number of pieces
	const [pricePerCubicMeter, setPricePerCubicMeter] = useState("");

	// New fields for "Кубатура вагонки"
	const [surfaceWidth, setSurfaceWidth] = useState("");
	const [surfaceLength, setSurfaceLength] = useState("");
  const [resultVolume, setResultVolume] = useState(null);
  const [resultPrice, setResultPrice] = useState(null);

  const router = useRouter();
  useEffect(() => {
    const checkUserId = async () => {
      try {
        const userId = await AsyncStorage.getItem('user_id');
        if (!userId) {
          router.push('/'); // Переход на главную страницу
        }
      } catch (error) {
        console.error('Ошибка проверки пользователя:', error);
      }
    };

    checkUserId();
  }, [router]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user_id'); // Очистить user_id
      router.push('/'); // Перенаправить на главную страницу
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

	const handleCalculate = () => {
    // Check for required fields
    if (
        !quantity ||
        (shape === "rectangular" && (!width || !thickness || !length)) ||
        (shape === "round" && !diameter) ||
        (operation === "5" && (!surfaceWidth || !surfaceLength || !width || !length))
    ) {
        alert("Пожалуйста, заполните все поля.");
        return;
    }

    let volume = 0;
    let price = 0;
    
    
    // Calculate volume based on the operation and shape
    if (operation === "2") {
        volume = calculateBoardVolume();
    } else if (operation === "1") {
        volume = calculateBeamVolume();
    } else if (operation === "3") {
        volume = calculateLumberVolume();
    } else if (operation === "4") {
        volume = calculateLogVolume();
    } else if (operation === "5") {
        volume = calculatePanelVolume();
    }

    // Calculate price
    const pricePerCubicMeterValue = parseFloat(pricePerCubicMeter);
    if (!isNaN(pricePerCubicMeterValue)) {
        price = volume * pricePerCubicMeterValue;
    }

    // Display result
    alert(`Объем: ${volume.toFixed(2)} м³\nЦена: ${price.toFixed(2)} руб.`);
  
    setResultVolume(volume);
    setResultPrice(price);
};

const calculateBoardVolume = () => {
    // Convert width, thickness, and length from mm to m
    const widthInM = parseFloat(width) / 1000;
    const thicknessInM = parseFloat(thickness) / 1000;
    const lengthInM = parseFloat(length) / 1000;
    return widthInM * thicknessInM * lengthInM * (calculationType === "volume" ? parseFloat(quantity) : 1);
};

const calculateBeamVolume = () => {
    // Similar to the board volume calculation
    const widthInM = parseFloat(width) / 1000;
    const thicknessInM = parseFloat(thickness) / 1000;
    const lengthInM = parseFloat(length) / 1000;
    return widthInM * thicknessInM * lengthInM * (calculationType === "volume" ? parseFloat(quantity) : 1);
};

const calculateLumberVolume = () => {
    if (shape === "rectangular") {
        const widthInM = parseFloat(width) / 1000;
        const thicknessInM = parseFloat(thickness) / 1000;
        const lengthInM = parseFloat(length) / 1000;
        return widthInM * thicknessInM * lengthInM * (calculationType === "volume" ? parseFloat(quantity) : 1);
    } else if (shape === "round") {
        const diameterInM = parseFloat(diameter) / 1000;
        const lengthInM = parseFloat(length) / 1000;
        const radius = diameterInM / 2;
        return Math.PI * Math.pow(radius, 2) * lengthInM * (calculationType === "volume" ? parseFloat(quantity) : 1);
    }
    return 0;
};

const calculateLogVolume = () => {
    // Similar to lumber volume calculation, can be customized if needed
    return calculateLumberVolume();
};

const calculatePanelVolume = () => {
    // For "Кубатура вагонки", calculate based on surface area
    const surfaceWidthInM = parseFloat(surfaceWidth);
    const surfaceLengthInM = parseFloat(surfaceLength);
    return surfaceWidthInM * surfaceLengthInM * (calculationType === "volume" ? parseFloat(quantity) : 1);
};

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Text style={styles.title}>Калькулятор кубатуры</Text>

			{/* Operation Selection */}
			<View style={styles.section}>
				<Text style={styles.label}>Выберите вид калькулятора:</Text>
				<View style={styles.radioGroupContainer}>
					<View style={styles.radioGroupColumn}>
						<TouchableOpacity
							onPress={() => setOperation("5")}
							style={[
								styles.radioButton,
								operation === "5" && styles.radioButtonSelected,
							]}
						>
							<Text style={styles.radioText}>
								Кубатура вагонки
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => setOperation("4")}
							style={[
								styles.radioButton,
								operation === "4" && styles.radioButtonSelected,
							]}
						>
							<Text style={styles.radioText}>
								Кубатура бревна
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => setOperation("3")}
							style={[
								styles.radioButton,
								operation === "3" && styles.radioButtonSelected,
							]}
						>
							<Text style={styles.radioText}>
								Кубатура пиломатериала
							</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.radioGroupColumn}>
						<TouchableOpacity
							onPress={() => setOperation("2")}
							style={[
								styles.radioButton,
								operation === "2" && styles.radioButtonSelected,
							]}
						>
							<Text style={styles.radioText}>Кубатура досок</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => setOperation("1")}
							style={[
								styles.radioButton,
								operation === "1" && styles.radioButtonSelected,
							]}
						>
							<Text style={styles.radioText}>Кубатура бруса</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>

			{/* Calculation Type Selection */}
			{(operation === "2" ||
				operation === "1" ||
				operation === "3" ||
				operation === "4") && (
				<View style={styles.section}>
					<Text style={styles.label}>Выберите тип расчета:</Text>
					<View style={styles.radioGroup}>
						<TouchableOpacity
							onPress={() => setCalculationType("volume")}
							style={styles.radioOption}
						>
							<View style={styles.radioCircle}>
								{calculationType === "volume" && (
									<View style={styles.radioChecked} />
								)}
							</View>
							<Text style={styles.radioLabel}>
								Количество в кубах
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => setCalculationType("pieces")}
							style={styles.radioOption}
						>
							<View style={styles.radioCircle}>
								{calculationType === "pieces" && (
									<View style={styles.radioChecked} />
								)}
							</View>
							<Text style={styles.radioLabel}>
								Объем по штукам
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			)}

			{/* Lumber Shape Selection for "Кубатура пиломатериала" */}
			{operation === "3" && (
				<View style={styles.section}>
					<Text style={styles.label}>
						Выберите форму пиломатериала:
					</Text>
					<View style={styles.radioGroup}>
						<TouchableOpacity
							onPress={() => setShape("rectangular")}
							style={[
								styles.radioButton,
								shape === "rectangular" &&
									styles.radioButtonSelected,
							]}
						>
							<Text style={styles.radioText}>Прямоугольный</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => setShape("round")}
							style={[
								styles.radioButton,
								shape === "round" && styles.radioButtonSelected,
							]}
						>
							<Text style={styles.radioText}>Круглый</Text>
						</TouchableOpacity>
					</View>
				</View>
			)}

			{/* Specific Inputs for "Кубатура вагонки" */}
			{operation === "5" && (
				<>
					<View style={styles.section}>
						<Text style={styles.label}>Ширина поверхности, м:</Text>
						<TextInput
							style={styles.input}
							placeholder="Введите ширину поверхности"
							value={surfaceWidth}
							onChangeText={setSurfaceWidth}
							keyboardType="numeric"
						/>
					</View>

					<View style={styles.section}>
						<Text style={styles.label}>Длина поверхности, м:</Text>
						<TextInput
							style={styles.input}
							placeholder="Введите длину поверхности"
							value={surfaceLength}
							onChangeText={setSurfaceLength}
							keyboardType="numeric"
						/>
					</View>
				</>
			)}

			{/* Shape-specific inputs */}
			{shape === "rectangular" && (
				<>
					<View style={styles.section}>
						<Text style={styles.label}>Ширина, мм:</Text>
						<TextInput
							style={styles.input}
							placeholder="Введите ширину"
							value={width}
							onChangeText={setWidth}
							keyboardType="numeric"
						/>
					</View>

					{operation !== "5" && (
						<View style={styles.section}>
							<Text style={styles.label}>Толщина, мм:</Text>
							<TextInput
								style={styles.input}
								placeholder="Введите толщину"
								value={thickness}
								onChangeText={setThickness}
								keyboardType="numeric"
							/>
						</View>
					)}

					<View style={styles.section}>
						<Text style={styles.label}>Длина, мм:</Text>
						<TextInput
							style={styles.input}
							placeholder="Введите длину"
							value={length}
							onChangeText={setLength}
							keyboardType="numeric"
						/>
					</View>
				</>
			)}

			{shape === "round" && (
				<>
					<View style={styles.section}>
						<Text style={styles.label}>Диаметр, мм:</Text>
						<TextInput
							style={styles.input}
							placeholder="Введите диаметр"
							value={diameter}
							onChangeText={setDiameter}
							keyboardType="numeric"
						/>
					</View>

					<View style={styles.section}>
						<Text style={styles.label}>Длина, мм:</Text>
						<TextInput
							style={styles.input}
							placeholder="Введите длину"
							value={length}
							onChangeText={setLength}
							keyboardType="numeric"
						/>
					</View>
				</>
			)}

			{/* Quantity or Volume Input based on calculationType */}
			<View style={styles.section}>
				<Text style={styles.label}>
					{calculationType === "volume"
						? "Количество кубов:"
						: "Количество штук:"}
				</Text>
				<TextInput
					style={styles.input}
					placeholder={
						calculationType === "volume"
							? "Введите объем в кубах"
							: "Введите количество штук"
					}
					value={quantity}
					onChangeText={setQuantity}
					keyboardType="numeric"
				/>
			</View>

			{/* Wood Type Picker */}
			<View style={styles.section}>
				<Text style={styles.label}>Порода древесины:</Text>
				<View style={styles.pickerContainer}>
					<Picker
						selectedValue={woodType}
						onValueChange={setWoodType}
						style={styles.picker}
					>
						<Picker.Item label="Пихта (410 кг/м³)" value="410" />
						<Picker.Item label="Ель (450 кг/м³)" value="450" />
						<Picker.Item label="Липа (510 кг/м³)" value="510" />
						<Picker.Item label="Сосна (520 кг/м³)" value="520" />
						<Picker.Item label="Кедр (570 кг/м³)" value="570" />
						<Picker.Item label="Лиственница (635 кг/м³)" value="635"/>
						<Picker.Item label="Береза (650 кг/м³)" value="650" />
						<Picker.Item label="Бук (680 кг/м³)" value="680" />
						<Picker.Item label="Ясень (750 кг/м³)" value="750" />
						<Picker.Item label="Дуб (810 кг/м³)" value="810" />
					</Picker>
				</View>
			</View>

			{/* Price per Cubic Meter Input */}
			<View style={styles.section}>
				<Text style={styles.label}>Цена за куб. м:</Text>
				<TextInput
					style={styles.input}
					placeholder="Введите цену за куб. м"
					value={pricePerCubicMeter}
					onChangeText={setPricePerCubicMeter}
					keyboardType="numeric"
				/>
			</View>

    {/* Calculate Button */}
    <Button title="Рассчитать" onPress={handleCalculate} />

    {/* Result Display */}
    {resultVolume !== null && resultPrice !== null && (
        <View style={styles.resultContainer}>
            <Text style={styles.resultText}>
                Объем: {resultVolume.toFixed(2)} м³
            </Text>
            <Text style={styles.resultText}>
                Цена: {resultPrice.toFixed(2)} руб.
            </Text>
        </View>
    )}
	<View style={styles.footer}>
        <Button title="Logout" onPress={handleLogout} color="#ff6347" />
      </View>

		</ScrollView>
	);
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#f8f8f8',
  },
    resultContainer: {
      marginTop: 20,
      padding: 10,
      backgroundColor: '#e0f7fa',
      borderRadius: 5,
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00796b',
},
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    backgroundColor: '#4CAF50',

  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#4CAF50',
    backgroundColor: '#4CAF50',
    borderWidth: 1,
    paddingLeft: 10,
    fontSize: 16,
  },
  pickerContainer: {
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  picker: {
    height: 50,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioGroupContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioGroupColumn: {
    width: '48%',
  },
  radioButton: {
    padding: 10,
    backgroundColor: '#4CAF50',
    margin: 5,
    borderRadius: 5,
  },
  radioButtonSelected: {
    backgroundColor: '#007bff',
  },
  radioText: {
    fontSize: 16,
    color: '#000',
  },
  radioLabel: {
    fontSize: 16,
    marginLeft: 10,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderColor: '#007bff',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioChecked: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007bff',
  },
});
