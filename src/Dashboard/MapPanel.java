package Dashboard;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Container;
import java.awt.Dimension;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.image.BufferedImage;
import java.net.URL;
import javax.imageio.ImageIO;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextArea;

public class MapPanel {

	//Fields for MapPanel
	private String url = "https://maps.googleapis.com/maps/api/staticmap?center=29.564835,-95.081320&zoom=19&size=640x640&maptype"
			+ "=satellite&scale=2"; //standard url minus API key
	private String key = "&format=png&key=AIzaSyDBb3g0eo0EZaX5eCQQtAn5Rsi7DgIYByk"; //personal API key for url
	private String finalURL = url + key; //url to be used
	private JPanel mainPanel;
	private JPanel mapPanel;
	private JPanel addPointPanel;
	private JLabel picLabel;
	private BufferedImage previewImage;
	private Image previewImageFinal;
	
	public static JButton inputButton = new JButton("Add Point");
	public static JTextArea colorTextArea = new JTextArea("color");
	public static JTextArea xTextArea = new JTextArea("x");
	public static JTextArea yTextArea = new JTextArea("y");
	private String xString;
	private String yString;
	private String colorString;
	private String pointString;
	
	/**
	 * Constructor, builds JPanel and adds map to it
	 */
	public MapPanel(){
		//Adds main panel
		mainPanel = new JPanel(new BorderLayout());
		//Creates Map
		mapPanel = new JPanel();
		try{
			previewImage = ImageIO.read(new URL(finalURL));
			previewImageFinal = previewImage.getScaledInstance(700,700,1);
			//previewImage = resize(previewImage, 700, 700);
			picLabel = new JLabel(new ImageIcon(previewImageFinal));
			mapPanel.add(picLabel, BorderLayout.CENTER);
		} catch(Exception e){
			//Do nothing
		}
		//Creates Panel for adding points to map
		addPointPanel = new JPanel();
		addPointPanel.setPreferredSize( new Dimension(100, 100) );
		addPointPanel.setLayout(new BorderLayout());
		//uneditTextArea.setEditable(false);
		xTextArea.setBackground(Color.WHITE);
		xTextArea.setForeground(Color.BLUE);     
		yTextArea.setBackground(Color.WHITE);
		yTextArea.setForeground(Color.BLUE);
		colorTextArea.setBackground(Color.WHITE);
		colorTextArea.setForeground(Color.BLUE);
		addPointPanel.add(xTextArea, BorderLayout.PAGE_START);
		addPointPanel.add(yTextArea, BorderLayout.CENTER);
		addPointPanel.add(colorTextArea, BorderLayout.PAGE_END);
		addPointPanel.add(inputButton, BorderLayout.EAST);
		this.inputButton.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				xString = xTextArea.getText();
				yString = yTextArea.getText();
				colorString = colorTextArea.getText();
				addPoint(colorString, Double.parseDouble(xString), Double.parseDouble(yString));
			}
		});
		//Adds all panels to main panel
		mainPanel.add(mapPanel, BorderLayout.CENTER);
		mainPanel.add(addPointPanel, BorderLayout.SOUTH);
	}
	
	/**
	 * Returns the JPanel
	 * @return JPanel object
	 */
	public JPanel getPanel(){
		return mainPanel;
	}
	
	/**
	 * Adds a point to the map image
	 * @param color the color of the point
	 * @param xcoord the x-coordinate for the point
	 * @param ycoord the y-coordinate for the point
	 */
	public void addPoint(String color, double xcoord, double ycoord){
		this.url = this.url + "&markers=color:" + color + "%7Csize:tiny%7C" + Double.toString(xcoord) + "," + Double.toString(ycoord);
		this.finalURL = this.url + this.key;
		updateImage();
	}
	
	/**
	 * Removes old JPanel and adds new one with updated URL
	 */
	private void updateImage(){
		try{
			mapPanel.removeAll();
			this.previewImage = ImageIO.read(new URL(finalURL));
			previewImageFinal = previewImage.getScaledInstance(700,700,1);
			this.picLabel = new JLabel(new ImageIcon(previewImageFinal));
			mapPanel.add(picLabel);
		} catch(Exception e){
			//Do Nothing
		}
		mapPanel.revalidate();
		mapPanel.repaint();
	}
	
	
}
